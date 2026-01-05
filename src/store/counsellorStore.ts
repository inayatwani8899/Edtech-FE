// import { User, UserRole } from "@/types/auth";
import {create} from "zustand";
import { UserFormData } from "./userStore";
import api from "@/api/axios";
import { GenericResponse, Role, User, UserRole } from "@/types/types";
interface counselorState {
    // Counselor list state
    counselors: User[];
    counselor: User | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    limit: number;
    totalCount: number;
    searchTerm: string;
    debouncedSearchTerm: string;
    selectedCounselorId: string | null;
    deleteOpen: boolean;
    counsellorToEdit: User | null;
    // User form state
    roles: Role[];
    rolesLoading: boolean;
    formData: UserFormData;
    selectedRole: Role | undefined;

    // Actions
    createCounselor: (data: Partial<User>) => Promise<void>;
    updateCounselor: (id: string, data: Partial<User>) => Promise<void>;
    clearCounselor: () => void;
    deleteCounselor: () => Promise<void>;
    fetchCounselors: () => Promise<void>;
    fetchCounselor: (id: string) => Promise<void>;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setSearchTerm: (term: string) => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;

    // Form actions
    fetchRoles: () => Promise<void>;
    setFormData: (data: Partial<UserFormData>) => void;
    resetFormData: () => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRoleChange: (roleId: string) => void;
    handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Initial form state
const initialFormData: UserFormData = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    roleId: 0,
    role: "" as UserRole,
    isAdmin: false,
    highestQualification: "",
    yearsOfExperience: 0,
    areaOfSpecialization: "",
    currentOrganization: "",
    licenseNumber: "",
    professionalBio: "",
    gradeLevel: "",
    dateOfBirth: ""
};

export const useCounselorStore = create<counselorState>((set, get) => ({
    // Counselor list state
    counselors: [],
    counselor: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
    totalCount: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
    selectedCounselorId: null,
    deleteOpen: false,
    counsellorToEdit: null,
    // User form state
    roles: [],
    rolesLoading: false,
    formData: initialFormData,
    selectedRole: undefined,

    // User list actions
    setPage: (page) => {
        set({ currentPage: page });
        get().fetchCounselors();
    },

    setLimit: (limit) => {
        set({ limit, currentPage: 1 });
        get().fetchCounselors();
    },

    setSearchTerm: (term) => {
        set({ searchTerm: term });
        setTimeout(() => {
            set({ debouncedSearchTerm: term, currentPage: 1 });
            get().fetchCounselors();
        }, 500);
    },
    fetchCounselors: async () => {
        set({ loading: true, error: null });
        const { currentPage, limit, debouncedSearchTerm } = get();
        try {
            const response = await api.get<GenericResponse>("/Counsellor", {
                params: {
                    page: currentPage,
                    limit,
                    search: debouncedSearchTerm || undefined
                },
            });

            const totalCount = response.data.data.totalCount;
            const calculatedTotalPages = Math.ceil(totalCount / limit);

            set({
                counselors: response.data.data.counsellors,
                totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1,
                totalCount: totalCount,
                currentPage: currentPage > calculatedTotalPages ? 1 : currentPage,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to fetch counselors.",
                counselors: [],
                totalPages: 1,
                totalCount: 0
            });
        } finally {
            set({ loading: false });
        }
    },

    createCounselor: async (data) => {
        set({ loading: true, error: null });
        try {
            await api.post("/Counsellor/register", data);
            await get().fetchCounselors();
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to create counselor" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchCounselor: async (id: string) => {
        if (!id) return;
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/Counsellor/${id}`);
            set({ counselor: res.data.data });
        } catch (err: any) {
            console.error("Failed to fetch counselor:", err);
            set({ error: err.response?.data?.message || "Failed to fetch counselor", counselor: null });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    updateCounselor: async (id, data) => {
        data.id=id;
        set({ loading: true, error: null });
        try {
            await api.put(`/Counsellor`, data);
            await get().fetchCounselors();
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to update counselor." });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    deleteCounselor: async () => {
        const { selectedCounselorId, fetchCounselors, currentPage, counselors } = get();
        if (!selectedCounselorId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`/Counsellor/${selectedCounselorId}`);

            const remainingCounselors = counselors.filter(counselor => counselor.id !== selectedCounselorId);
            if (remainingCounselors.length === 0 && currentPage > 1) {
                set({ currentPage: currentPage - 1 });
            }

            set({ deleteOpen: false, selectedCounselorId: null });
            await fetchCounselors();
        } catch (err: any) {
            console.error("Failed to delete user:", err);
            set({ error: err.response?.data?.message || "Failed to delete user" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    clearCounselor: () => set({ counselor: null, counsellorToEdit: null, error: null }),

    openDeleteDialog: (id: string) => set({ selectedCounselorId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ selectedCounselorId: null, deleteOpen: false }),

    // Form actions
    fetchRoles: async () => {
        set({ rolesLoading: true });
        try {
            const res = await api.get("/Role");
            const roles = res.data.data.filter((role: Role) => !role.isDeleted);
            set({ roles });

            // Update selectedRole based on current formData
            const { formData } = get();
            const selectedRole = roles.find((r: Role) => r.id === formData.roleId);
            set({ selectedRole });
        } catch (err) {
            console.error("Failed to fetch roles:", err);
        } finally {
            set({ rolesLoading: false });
        }
    },

    setFormData: (data) => {
        set((state) => ({
            formData: { ...state.formData, ...data },
            selectedRole: state.roles.find(role => role.id === (data.roleId || state.formData.roleId))
        }));
    },

    resetFormData: () => {
        set({
            formData: initialFormData,
            selectedRole: undefined,
            counselor: null
        });
    },

    handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        set((state) => ({
            formData: {
                ...state.formData,
                [name]: type === "checkbox" ? checked : value,
            }
        }));
    },

    handleRoleChange: (roleId: string) => {
        const { roles } = get();
        const roleObj = roles.find((r) => String(r.id) === roleId);
        set((state) => ({
            formData: {
                ...state.formData,
                roleId: Number(roleId),
                role: roleObj ? (roleObj.name as UserRole) : state.formData.role,
            },
            selectedRole: roleObj
        }));
    },

    handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        set((state) => ({
            formData: {
                ...state.formData,
                [name]: Number(value),
            }
        }));
    },
}));