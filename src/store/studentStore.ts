import { create } from "zustand";
import api from "@/api/axios";
import { GenericResponse } from "@/types/types";
import { useAuthStore } from "./useAuthStore";

// Define the Student interface based on API response
export interface Student {
    id: number;
    userId: number;
    gradeLevel?: string;
    gradeId?: number;
    gradeName?: string;
    dateOfBirth: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    gender?: string;
}

interface StudentResponseData {
  students: Student[];
  totalCount: number;
}

interface StudentState {
  // Student list state
  students: Student[];
  student: Student | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  limit: number;
  totalCount: number;
  searchTerm: string;
  debouncedSearchTerm: string;
  selectedStudentId: string | null;
  deleteOpen: boolean;
  studentToEdit: Student | null;
  
  sortDirection: 'asc' | 'desc';

  // Actions
  createStudent: (data: any) => Promise<void>;
  updateStudent: (id: string, data: any) => Promise<void>;
  clearStudent: () => void;
  deleteStudent: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchStudent: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
}

export const useStudentStore = create<StudentState>((set, get) => ({
  // Student list state
  students: [],
  student: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  totalCount: 0,
  searchTerm: "",
  debouncedSearchTerm: "",
  selectedStudentId: null,
  deleteOpen: false,
  studentToEdit: null,
  sortDirection: 'asc',

  // Student list actions
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchStudents();
  },

  setLimit: (limit) => {
    set({ limit, currentPage: 1 });
    get().fetchStudents();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    setTimeout(() => {
      set({ debouncedSearchTerm: term, currentPage: 1 });
      get().fetchStudents();
    }, 500);
  },
  
  setSortDirection: (direction) => {
    set({ sortDirection: direction, currentPage: 1 });
    get().fetchStudents();
  },

  fetchStudents: async () => {
    set({ loading: true, error: null });
    const { currentPage, limit, debouncedSearchTerm, sortDirection } = get();
    
    // Check if the current user has a School or OrganizationAdmin role
    const user = useAuthStore.getState().user;
    const isSchool = user?.roleId === 4 || 
                     user?.roleId === 3 ||
                     user?.role?.toLowerCase() === "school" || 
                     user?.role?.toLowerCase() === "organization" ||
                     user?.role?.toLowerCase() === "organizationadmin";

    const endpoint = isSchool ? "/Organization/students" : "/Student";

    try {
      const response = await api.get<GenericResponse<StudentResponseData>>(endpoint, {
        params: {
          page: currentPage,
          limit,
          search: debouncedSearchTerm || undefined,
          sortDirection
        },
      });

      const studentsList = response.data.data.students || [];
      const totalCount = response.data.data.totalCount ?? studentsList.length ?? 0;
      const calculatedTotalPages = Math.ceil(totalCount / limit);

      set({
        students: studentsList,
        totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1,
        totalCount: totalCount,
        currentPage: currentPage > calculatedTotalPages ? 1 : currentPage,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch students.",
        students: [],
        totalPages: 1,
        totalCount: 0
      });
    } finally {
      set({ loading: false });
    }
  },

  createStudent: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const isSchool = user?.roleId === 4 || 
                       user?.roleId === 3 ||
                       user?.role?.toLowerCase() === "school" || 
                       user?.role?.toLowerCase() === "organization" ||
                       user?.role?.toLowerCase() === "organizationadmin";

      if (isSchool) {
        const payload = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password || "defaultPassword123",
          phone: data.phone || data.phoneNumber,
          phoneNumber: data.phone || data.phoneNumber,
          gradeLevel: data.gradeLevel,
          gradeId: data.gradeId ? Number(data.gradeId) : undefined,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
          gender: data.gender
        };
        await api.post("/Organization/students-added-through-organization", payload);
      } else {
        const transformedData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: "defaultPassword123",
          phone: data.phone || data.phoneNumber,
          gradeLevel: data.gradeLevel,
          dateOfBirth: data.dateOfBirth,
          isAdmin: false,
          createdBy: 1
        };
        await api.post("/Student/admin/create", transformedData);
      }
      await get().fetchStudents();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to create student" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchStudent: async (id: string) => {
    if (!id) return;
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const isSchool = user?.roleId === 4 || 
                       user?.roleId === 3 ||
                       user?.role?.toLowerCase() === "school" || 
                       user?.role?.toLowerCase() === "organization" ||
                       user?.role?.toLowerCase() === "organizationadmin";

      if (isSchool) {
        const response = await api.get<any>(`/Organization/students/${id}`);
        if (response.data && response.data.success) {
          set({ student: response.data.data });
        } else {
          set({ student: response.data });
        }
      } else {
        const response = await api.get<GenericResponse<StudentResponseData>>("/Student");
        const student = response.data.data.students.find(s => s.id === Number(id));
        if (student) {
          set({ student });
        } else {
          throw new Error("Student not found");
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch student:", err);
      set({ error: err.response?.data?.message || err.message || "Failed to fetch student", student: null });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateStudent: async (id, data) => {
    data.id = Number(id); // Add the ID to the data payload
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const isSchool = user?.roleId === 4 || 
                       user?.roleId === 3 ||
                       user?.role?.toLowerCase() === "school" || 
                       user?.role?.toLowerCase() === "organization" ||
                       user?.role?.toLowerCase() === "organizationadmin";

      if (isSchool) {
        const payload = {
          id: Number(id),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || data.phoneNumber,
          phoneNumber: data.phone || data.phoneNumber,
          gradeLevel: data.gradeLevel,
          gradeId: data.gradeId ? Number(data.gradeId) : undefined,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : null,
          gender: data.gender
        };
        await api.put(`/Organization/students/${id}`, payload);
      } else {
        await api.put(`/Student`, data);
      }
      await get().fetchStudents();
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to update student" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteStudent: async () => {
    const { selectedStudentId, fetchStudents, currentPage, students } = get();
    if (!selectedStudentId) return;

    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const isSchool = user?.roleId === 4 || 
                       user?.roleId === 3 ||
                       user?.role?.toLowerCase() === "school" || 
                       user?.role?.toLowerCase() === "organization" ||
                       user?.role?.toLowerCase() === "organizationadmin";

      const endpoint = isSchool ? `/Organization/students/${selectedStudentId}` : `/Student/${selectedStudentId}`;
      await api.delete(endpoint);

      const remainingStudents = students.filter(student => student.id !== Number(selectedStudentId));
      if (remainingStudents.length === 0 && currentPage > 1) {
        set({ currentPage: currentPage - 1 });
      }

      set({ deleteOpen: false, selectedStudentId: null });
      await fetchStudents();
    } catch (err: any) {
      console.error("Failed to delete student:", err);
      set({ error: err.response?.data?.message || "Failed to delete student" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearStudent: () => set({ student: null, studentToEdit: null, error: null }),

  openDeleteDialog: (id: string) => set({ selectedStudentId: id, deleteOpen: true }),
  closeDeleteDialog: () => set({ selectedStudentId: null, deleteOpen: false }),
}));