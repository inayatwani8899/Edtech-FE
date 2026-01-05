import { create } from "zustand";
import api from "@/api/axios";
import { User, GenericResponse, UserRole } from "@/types/types";

interface Role {
    id: number;
    name: string;
    isDeleted: boolean;
}

export interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    roleId: number;
    role: UserRole;
    isAdmin: boolean;
    highestQualification: string;
    yearsOfExperience: number;
    areaOfSpecialization: string;
    currentOrganization: string;
    licenseNumber: string;
    professionalBio: string;
    gradeLevel: string;
    dateOfBirth: string;
}

interface UserState {
    // User list state
    users: User[];
    user: User | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    limit: number;
    totalCount: number;
    searchTerm: string;
    debouncedSearchTerm: string;
    selectedUserId: string | null;
    deleteOpen: boolean;
    userToEdit: User | null;
    // User form state
    roles: Role[];
    rolesLoading: boolean;
    formData: UserFormData;
    selectedRole: Role | undefined;

    // Actions
    createUser: (data: Partial<User>) => Promise<void>;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    clearUser: () => void;
    deleteUser: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchUser: (id: string) => Promise<void>;
    fetchPublishedTests: () => Promise<void>;
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

export const useUserStore = create<UserState>((set, get) => ({
    // User list state
    users: [],
    user: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    limit: 5,
    totalCount: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
    selectedUserId: null,
    deleteOpen: false,
    userToEdit: null,
    // User form state
    roles: [],
    rolesLoading: false,
    formData: initialFormData,
    selectedRole: undefined,

    // User list actions
    setPage: (page) => {
        set({ currentPage: page });
        get().fetchUsers();
    },

    setLimit: (limit) => {
        set({ limit, currentPage: 1 });
        get().fetchUsers();
    },

    setSearchTerm: (term) => {
        set({ searchTerm: term });
        setTimeout(() => {
            set({ debouncedSearchTerm: term, currentPage: 1 });
            get().fetchUsers();
        }, 500);
    },
    fetchPublishedTests: async () => {
     try {
        
     } catch (error) {
        
     }finally{
        
     }
    },
    fetchUsers: async () => {
        set({ loading: true, error: null });
        const { currentPage, limit, debouncedSearchTerm } = get();
        try {
            const response = await api.get<GenericResponse>("/User", {
                params: {
                    page: currentPage,
                    limit,
                    search: debouncedSearchTerm || undefined
                },
            });

            const totalCount = response.data.data.totalCount;
            const calculatedTotalPages = Math.ceil(totalCount / limit);

            set({
                users: response.data.data.users,
                totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1,
                totalCount: totalCount,
                currentPage: currentPage > calculatedTotalPages ? 1 : currentPage,
            });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || "Failed to fetch users.",
                users: [],
                totalPages: 1,
                totalCount: 0
            });
        } finally {
            set({ loading: false });
        }
    },

    createUser: async (data) => {
        set({ loading: true, error: null });
        try {
            await api.post("/User", data);
            await get().fetchUsers();
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to create user" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchUser: async (id: string) => {
        if (!id) return;
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/User/${id}`);
            set({ user: res.data.data.user });
        } catch (err: any) {
            console.error("Failed to fetch user:", err);
            set({ error: err.response?.data?.message || "Failed to fetch user", user: null });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    updateUser: async (id, data) => {
        data.id=id;
        set({ loading: true, error: null });
        try {
            await api.put(`/User/update`, data);
            await get().fetchUsers();
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to update user" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    deleteUser: async () => {
        const { selectedUserId, fetchUsers, currentPage, users } = get();
        if (!selectedUserId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`/User/${selectedUserId}`);

            const remainingUsers = users.filter(user => user.id !== selectedUserId);
            if (remainingUsers.length === 0 && currentPage > 1) {
                set({ currentPage: currentPage - 1 });
            }

            set({ deleteOpen: false, selectedUserId: null });
            await fetchUsers();
        } catch (err: any) {
            console.error("Failed to delete user:", err);
            set({ error: err.response?.data?.message || "Failed to delete user" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    clearUser: () => set({ user: null, userToEdit: null, error: null }),

    openDeleteDialog: (id: string) => set({ selectedUserId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ selectedUserId: null, deleteOpen: false }),

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
            user: null
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