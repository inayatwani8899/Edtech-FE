import { create } from "zustand";
import api from "@/api/axios";
import { GenericResponse, StudentProfile, StudentProfileResponse } from "@/types/types";

interface StudentProfileState {
  profile: StudentProfile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchStudentProfile: (id: number) => Promise<void>;
  updateStudentProfile: (id: number, profile: Partial<StudentProfile>) => Promise<void>;
  clearProfile: () => void;
}

export const useStudentProfileStore = create<StudentProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,
  
  fetchStudentProfile: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<StudentProfileResponse>(`/Student/${id}`);
      set({ profile: response.data.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to fetch student profile" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  
  updateStudentProfile: async (id: number, profileData: Partial<StudentProfile>) => {
    set({ loading: true, error: null });
    try {
      // Include the ID in the request body as per API requirements
      const updateData = { ...profileData, id };
      const response = await api.put<GenericResponse<StudentProfile>>("/Student", updateData);
      set({ profile: response.data.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update student profile" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  
  clearProfile: () => set({ profile: null, error: null }),
}));