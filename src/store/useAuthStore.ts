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
import { LoginResponse, User } from "@/types/auth";
import api from "@/api/axios";
import { useTestStore } from "./testStore";

import Swal from "sweetalert2";
import { usePaymentStore } from "./paymentStore";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  testId: string,
  roleId: string,
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerStudent: (payload) => Promise<{ success: boolean, error?: any }>;
  registerCounsellor: (firstName: string, lastName: string, email: string, password: string, dateOfBirth: string, grade: string, phone: string, role: string) => Promise<void>;

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
    loadFromStorage: () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        set({
          token,
          user: JSON.parse(userData),
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    },

    login: async (email, password) => {
      set({ isLoading: true });
      try {
        const { data } = await api.post<LoginResponse>("/Auth/login", { email, password });

        const { access_Token, user } = data.data;

        localStorage.setItem("auth_token", access_Token);
        localStorage.setItem("roleId", String(user.roleId))
        localStorage.setItem("user_data", JSON.stringify(user));

        set({
          user,
          token: access_Token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (err) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
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
    logout: () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      set({ user: null, token: null, isAuthenticated: false });
    },
  })
);
