// src/store/useAuthStore.ts
import { create } from 'zustand';
import api from '@/api/axios';
import { User } from '@/types/auth';

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_Token: string;
    token_Type: string;
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
    grade: string,
    phone: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post<LoginResponse>('Auth/login', { email, password });
      const { access_Token, user } = response.data.data;

      localStorage.setItem('auth_token', access_Token);
      localStorage.setItem('user_data', JSON.stringify(user));

      set({ user, token: access_Token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ isLoading: false, user: null, token: null, isAuthenticated: false });
      throw err;
    }
  },

  register: async (firstName, lastName, email, password, dateOfBirth, grade, phone, role) => {
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

      // Auto login after registration
      await get().login(email, password);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  restoreSession: () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user: User = JSON.parse(userData);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  },
}));
