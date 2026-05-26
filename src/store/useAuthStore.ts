// // src/store/useAuthStore.ts
// import { create } from 'zustand';
// import api from '@/api/axios';
// import { User } from '@/types/auth';

// export interface LoginResponse {
//   code: number;
//   message: string;
//   data: {
//     access_Token: string;
//     token_Type: string;
//     user: User;
//   };
// }

// interface AuthState {
//   loadFromStorage: any;
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<User>;
//   register: (
//     firstName: string,
//     lastName: string,
//     email: string,
//     password: string,
//     dateOfBirth: string,
//     grade: string,
//     phone: string,
//     role: string
//   ) => Promise<void>;
//   logout: () => void;
//   updateProfile: (updates: Partial<User>) => void;
//   restoreSession: () => void;
// }

// export const useAuthStore = create<AuthState>((set, get) => ({
//   user: null,
//   token: null,
//   isLoading: false,
//   isAuthenticated: false,

//   login: async (email, password) => {
//     set({ isLoading: true });

//     try {
//       const response = await api.post<LoginResponse>('Auth/login', { email, password });
//       const { access_Token, user } = response.data.data;

//       localStorage.setItem('auth_token', access_Token);
//       localStorage.setItem('user_data', JSON.stringify(user));

//       set({ user, token: access_Token, isAuthenticated: true, isLoading: false });
//       return user;
//     } catch (err) {
//       set({ isLoading: false, user: null, token: null, isAuthenticated: false });
//       throw err;
//     }
//   },

//   register: async (firstName, lastName, email, password, dateOfBirth, grade, phone, role) => {
//     set({ isLoading: true });
//     try {
//       await api.post('Auth/register', {
//         firstName,
//         lastName,
//         email,
//         password,
//         dateOfBirth,
//         grade,
//         phone,
//         role,
//       });

//       // Auto login after registration
//       await get().login(email, password);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('user_data');
//     set({ user: null, token: null, isAuthenticated: false });
//   },

//   updateProfile: (updates) => {
//     const { user } = get();
//     if (!user) return;

//     const updatedUser = { ...user, ...updates };
//     localStorage.setItem('user_data', JSON.stringify(updatedUser));
//     set({ user: updatedUser });
//   },

//   restoreSession: () => {
//     const token = localStorage.getItem('auth_token');
//     const userData = localStorage.getItem('user_data');

//     if (token && userData) {
//       try {
//         const user: User = JSON.parse(userData);
//         set({ user, token, isAuthenticated: true });
//       } catch {
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user_data');
//       }
//     }
//   },
// }));
import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { LoginResponse, User, Permission } from "@/types/auth";
import api from "@/api/axios";
import { useTestStore } from "./testStore";

import Swal from "sweetalert2";
import { usePaymentStore } from "./paymentStore";

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
  login: (email: string, password: string, tenantName?: string | null) => Promise<void>;
  logout: () => void;
  registerStudent: (payload: any) => Promise<{ success: boolean, error?: any }>;
  registerCounsellor: (firstName: string, lastName: string, email: string, password: string, dateOfBirth: string, grade: string, phone: string, role: string) => Promise<void>;
  registerSchool: (payload: any) => Promise<{ success: boolean, error?: any }>;

  loadFromStorage: () => void;
  setTestId: (testId: string | null) => void;
}

export const useAuthStore = create<AuthState>(
  (set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // start loading
    testId: null,
    roleId: null,
    permissions: [],
    loadFromStorage: () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");
      const permissionsData = localStorage.getItem("user_permissions");

      if (token && userData) {
        set({
          token,
          user: JSON.parse(userData),
          permissions: permissionsData ? JSON.parse(permissionsData) : [],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    },

    login: async (email, password, routeTenant?: string | null) => {
      set({ isLoading: true });
      try {
        const isSuperAdminEmail = email.toLowerCase().includes('superadmin');
        const resolvedTenant = isSuperAdminEmail ? null : (routeTenant || getTenantFromHostname());

        const payload: any = { 
          email, 
          password,
          tenant: resolvedTenant || null
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
            // Both failed. If the first attempt got a real validation error from the server,
            // it is more meaningful than a network/CORS error from the fallback server.
            if (firstError && firstError.response) {
              throw firstError;
            }
            throw fallbackErr;
          }
        }

        if (loginSuccess && responseData) {
          const { access_Token, user, permissions = [] } = responseData.data;

          localStorage.setItem("auth_token", access_Token);
          localStorage.setItem("roleId", String(user.roleId));
          localStorage.setItem("user_data", JSON.stringify(user));
          localStorage.setItem("user_permissions", JSON.stringify(permissions));

          set({
            user,
            token: access_Token,
            permissions,
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
    // registerStudent: async (payload) => {
    //   set({ isLoading: true });
    //   try {

    //     const response = await api.post("/Student/register", payload);
    //     if (response.data.code === 201) {

    //       const { testId } = get();
    //       if (testId) {
    //         // Fetch test details
    //         // const testDetails = await useTestStore.getState().fetchTestById(testId);
    //         const testDetails = await api.get(`/Test/${testId}`);
    //         console.log(testDetails.data.data)


    //         const paymentResult = await usePaymentStore.getState().handlePayment(testDetails.data.data);


    //       } else {
    //         // navigate('/dashboard');
    //       }

    //     }
    //   } catch (error) {

    //   } finally {
    //     set({ isLoading: false });
    //     await get().login(payload.email, payload.password);
    //   }
    // },
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

        //   // Auto login after registration
        //   await get().login(email, password);
      } finally {
        set({ isLoading: false });
      }
    },
    registerSchool: async (formData: FormData) => {
      set({ isLoading: true });
      try {
        const response = await api.post("Organization/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.code === 201 || response.status === 201) {
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
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_permissions");
      localStorage.removeItem("roleId");
      set({ user: null, token: null, permissions: [], isAuthenticated: false });
    },
  })
);
