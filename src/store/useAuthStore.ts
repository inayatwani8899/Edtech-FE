import { create } from "zustand";
import { LoginResponse, User, Permission } from "@/types/auth";
import api from "@/api/axios";
import Swal from "sweetalert2";
import { usePaymentStore } from "./paymentStore";

export interface StudentSession {
  token: string | null;
  tenant: string | null;
  studentId: number | null;
  gradeId: number | null;
  grade: string | null;
  role: string | null;
  email: string | null;
}

const getTenantFromHostname = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1" || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return null;
  }
  const parts = hostname.split('.');
  if (parts.length > 2) {
    const subdomain = parts[0].toLowerCase();
    if (subdomain !== "www" && subdomain !== "nervous-dubinsky" && subdomain !== "charming-bohr") {
      return subdomain;
    }
  }
  return null;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  testId: string | null;
  roleId: string | null;
  permissions: Permission[];
  tenantData: any | null;
  tenantLoading: boolean;
  tenantError: string | null;
  studentSession: StudentSession | null;
  
  login: (email: string, password: string, tenantName?: string | null) => Promise<void>;
  logout: () => void;
  registerStudent: (payload: any) => Promise<{ success: boolean, message?: string, error?: any }>;
  registerCounsellor: (firstName: string, lastName: string, email: string, password: string, dateOfBirth: string, grade: string, phone: string, role: string) => Promise<void>;
  registerSchool: (payload: any) => Promise<{ success: boolean, message?: string, error?: any }>;

  loadFromStorage: () => void;
  setTestId: (testId: string | null) => void;
  fetchTenantDetails: (tenantName: string) => Promise<any>;
  clearTenantDetails: () => void;
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    testId: null,
    roleId: null,
    permissions: [],
    tenantData: null,
    tenantLoading: false,
    tenantError: null,
    studentSession: null,

    loadFromStorage: () => {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("auth_token");
      const userData = localStorage.getItem("userData") || localStorage.getItem("user_data");
      const permissionsData = localStorage.getItem("user_permissions");
      const storedTenantData = localStorage.getItem("organizationData");
      const storedStudentSession = localStorage.getItem("studentSession");

      let studentSession: StudentSession | null = null;
      if (storedStudentSession) {
        try {
          studentSession = JSON.parse(storedStudentSession);
        } catch (e) {
          console.error("Error parsing studentSession from localStorage:", e);
        }
      }

      // Fallback reconstruction for refresh recovery
      if (!studentSession && token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          const tenantVal = localStorage.getItem("tenantName") || "";
          const gradeIdVal = localStorage.getItem("gradeId");
          const gradeVal = localStorage.getItem("grade");
          studentSession = {
            token: token,
            tenant: tenantVal,
            studentId: parsedUser.id ? Number(parsedUser.id) : null,
            gradeId: gradeIdVal ? Number(gradeIdVal) : (parsedUser.gradeId ? Number(parsedUser.gradeId) : null),
            grade: gradeVal || parsedUser.grade || "",
            role: parsedUser.role || "",
            email: parsedUser.email || ""
          };
        } catch (e) {
          console.error("Error reconstructing studentSession:", e);
        }
      }

      set({
        token: token || null,
        user: userData ? JSON.parse(userData) : null,
        permissions: permissionsData ? JSON.parse(permissionsData) : [],
        tenantData: storedTenantData ? JSON.parse(storedTenantData) : null,
        studentSession,
        isAuthenticated: !!(token && userData),
        isLoading: false,
      });
    },

    login: async (email, password, routeTenant?: string | null) => {
      set({ isLoading: true });
      try {
        const storedTenant = localStorage.getItem("tenantName");
        // Resolve tenant dynamically: URL -> hostname -> localStorage -> default to null (superadmin default login)
        const resolvedTenant = routeTenant || getTenantFromHostname() || storedTenant || null;

        const payload: any = { 
          email, 
          password,
          tenant: resolvedTenant
        };

        let loginSuccess = false;
        let responseData: any = null;
        let firstError: any = null;

        // Attempt 1: Try the Super Admin / Org API first (nervous-dubinsky)
        try {
          const res = await api.post<LoginResponse>("/Auth/login", payload, {
            baseURL: import.meta.env.VITE_ORG_API_BASE_URL || "https://nervous-dubinsky.180-179-213-167.plesk.page/api/"
          });
          responseData = res.data;
          loginSuccess = true;
        } catch (orgErr) {
          firstError = orgErr;
          console.warn("Login failed on the primary/org API, attempting fallback to the old API...", orgErr);
          
          // Attempt 2: Try the fallback/old URL (charming-bohr)
          try {
            const res = await api.post<LoginResponse>("/Auth/login", payload, {
              baseURL: import.meta.env.VITE_API_BASE_URL || "https://charming-bohr.180-179-213-167.plesk.page/api/"
            });
            responseData = res.data;
            loginSuccess = true;
          } catch (fallbackErr: any) {
            if (firstError && firstError.response) {
              throw firstError;
            }
            throw fallbackErr;
          }
        }

        if (loginSuccess && responseData) {
          const { access_Token, user, permissions = [] } = responseData.data;
          const tenant = responseData.data.tenant || resolvedTenant;
          const loginUrl = responseData.data.loginUrl || `/login/${tenant}`;
          
          let organizationId = "";
          const storedTenantData = localStorage.getItem("organizationData");
          if (storedTenantData) {
            try {
              const org = JSON.parse(storedTenantData);
              if (org && org.id) {
                organizationId = String(org.id);
              }
            } catch (e) {
              console.error("Error parsing stored organization data:", e);
            }
          }

          const studentSession: StudentSession = {
            token: access_Token,
            tenant: tenant || "",
            studentId: user.id ? Number(user.id) : null,
            gradeId: user.gradeId ? Number(user.gradeId) : null,
            grade: user.grade || "",
            role: user.role || "",
            email: user.email || ""
          };

          // Save required session keys
          localStorage.setItem("accessToken", access_Token);
          localStorage.setItem("auth_token", access_Token); // fallback compatibility
          localStorage.setItem("tenantName", tenant || "");
          localStorage.setItem("userId", String(user.id));
          localStorage.setItem("role", user.role || "");
          localStorage.setItem("roleId", String(user.roleId));
          localStorage.setItem("userData", JSON.stringify(user));
          localStorage.setItem("user_data", JSON.stringify(user)); // fallback compatibility
          localStorage.setItem("loginUrl", loginUrl);
          localStorage.setItem("user_permissions", JSON.stringify(permissions));
          if (organizationId) {
            localStorage.setItem("organizationId", organizationId);
          }

          localStorage.setItem("studentSession", JSON.stringify(studentSession));
          localStorage.setItem("studentId", String(studentSession.studentId || ""));
          localStorage.setItem("gradeId", String(studentSession.gradeId || ""));
          localStorage.setItem("grade", studentSession.grade || "");

          set({
            user,
            token: access_Token,
            permissions,
            studentSession,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } catch (err) {
        set({ user: null, token: null, permissions: [], isAuthenticated: false, isLoading: false });
        throw err;
      }
    },

    setTestId: (testId) => {
      set({ testId });
      if (testId) {
        localStorage.setItem("testId", testId);
      } else {
        localStorage.removeItem("testId");
      }
    },

    registerStudent: async (payload) => {
      set({ isLoading: true });
      try {
        const response = await api.post("/Student/register", payload);

        if (response.data.code === 201) {
          const testId = localStorage.getItem('testId');
          if (testId) {
            await get().login(payload.email, payload.password);
            const testDetails = await api.get(`/Test/${testId}`);
            const paymentResult = await usePaymentStore.getState().handlePayment(
              testDetails.data.data
            );
            localStorage.removeItem('testId');
            return paymentResult;
          }
          return {
            success: true,
            message: "Registration completed successfully",
            data: response.data
          };
        }
      } catch (error) {
        return { success: false, error };
      } finally {
        set({ isLoading: false });
      }
      return { success: false, message: "Registration failed" };
    },

    registerCounsellor: async (firstName, lastName, email, password, dateOfBirth, grade, phone, role) => {
      set({ isLoading: true });
      try {
        await api.post('Auth/register', {
          firstName,
          lastName,
          email,
          password,
          dateOfBirth,
          grade,
          phone,
          role,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    registerSchool: async (formData: FormData) => {
      set({ isLoading: true });
      try {
        const response = await api.post("Organization/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.code === 201 || response.status === 201 || response.data.success === true) {
          return {
            success: true,
            message: response.data.message || "Registration completed successfully",
            data: response.data
          };
        }
        return { success: false, error: response.data };
      } catch (error) {
        return { success: false, error };
      } finally {
        set({ isLoading: false });
      }
    },

    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("userData");
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_permissions");
      localStorage.removeItem("roleId");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("tenantName");
      localStorage.removeItem("loginUrl");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("organizationData");
      localStorage.removeItem("studentSession");
      localStorage.removeItem("studentId");
      localStorage.removeItem("gradeId");
      localStorage.removeItem("grade");
      set({ user: null, token: null, permissions: [], studentSession: null, isAuthenticated: false, tenantData: null });
    },

    fetchTenantDetails: async (tenantName: string) => {
      set({ tenantLoading: true, tenantError: null });
      try {
        const response = await api.get(`/SuperAdmin/organizations/tenant/${tenantName}`, {
          skipToast: true,
          headers: {
            "x-skip-toast": "true",
          } as any,
        } as any);

        const data = response.data?.data;
        if (data) {
          if (data.isVerified === false) {
            throw new Error("Organization is not verified yet.");
          }
          if (data.isActive === false) {
            throw new Error("Organization is currently inactive.");
          }
          localStorage.setItem("tenantName", data.tenantName || tenantName);
          localStorage.setItem("organizationId", String(data.id));
          localStorage.setItem("organizationData", JSON.stringify(data));
          set({
            tenantData: data,
            tenantLoading: false,
            tenantError: null,
          });
          return data;
        } else {
          throw new Error("Invalid tenant details received");
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || "Failed to fetch tenant details.";
        set({
          tenantData: null,
          tenantLoading: false,
          tenantError: msg,
        });
        localStorage.removeItem("tenantName");
        localStorage.removeItem("organizationId");
        localStorage.removeItem("organizationData");
        throw err;
      }
    },

    clearTenantDetails: () => {
      localStorage.removeItem("tenantName");
      localStorage.removeItem("organizationId");
      localStorage.removeItem("organizationData");
      set({ tenantData: null, tenantError: null });
    },
  })
);
