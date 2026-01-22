import { create } from "zustand";
import api from "@/api/axios";
import * as types from "@/types/types";

interface UserStatsState {
  stats: types.UserStats | null;
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
      // const response = await api.get<UserStatsResponse>("/User/stats");
      const response = await api.get<types.UserStatsResponse>("/Admin/dashboard-summary");
      // API sometimes returns the payload nested as { data: UserStats } inside response.datas
      const payload = (response.data as any)?.data ?? (response.data as any);
      set({ stats: payload as types.UserStats, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch user statistics",
        loading: false
      });
    }
  }
}));