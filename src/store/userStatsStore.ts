import { create } from "zustand";
import api from "@/api/axios";
import { UserStats, UserStatsResponse } from "@/types/types";

interface UserStatsState {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  fetchUserStats: () => Promise<void>;
}

export const useUserStatsStore = create<UserStatsState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  
  fetchUserStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<UserStatsResponse>("/User/stats");
      set({ stats: response.data.data, loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch user statistics", 
        loading: false 
      });
    }
  }
}));