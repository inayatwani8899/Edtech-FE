import { create } from 'zustand';
import api from '@/api/axios';
import { TestConfiguration } from '@/types/types';

interface TestConfigurationState {
    // State
    configurations: TestConfiguration[];
    currentConfiguration: TestConfiguration | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    deleteId: string | null;
    deleteOpen: boolean;
    currentPage: number;
    limit: number;
    totalConfigurationPages: number | null;
    totalConfigurationsCount: number | null;
    totalPages: number;
    // Actions
    setSearchTerm: (term: string) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Configuration CRUD Operations
    fetchConfigurations: () => Promise<void>;
    fetchConfigurationById: (id: string) => Promise<void>;
    createConfiguration: (config: TestConfiguration) => Promise<any>;
    updateConfiguration: (id: string, config: Partial<TestConfiguration>) => Promise<void>;
    deleteConfiguration: () => Promise<void>;
    fetchConfigurationByRoleIdTestId: (roleId: string, testId: string) => Promise<{ code: number, message: string, data: { testConfiguration: {} } }>;

    // UI State Management
    clearCurrentConfiguration: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;
}

export const useTestConfigurationStore = create<TestConfigurationState>((set, get) => ({
    // Initial state
    configurations: [],
    currentConfiguration: null,
    loading: false,
    error: null,
    searchTerm: "",
    deleteId: null,
    deleteOpen: false,
    currentPage: 1,
    limit: 5,
    totalConfigurationPages: null,
    totalConfigurationsCount: null,
    totalPages: null,
    // Actions
    setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
    setPage: (page: number) => set({ currentPage: page }),
    setLimit: (limit: number) => set({ limit, currentPage: 1 }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    // Configuration CRUD Operations
    fetchConfigurations: async () => {
        set({ loading: true, error: null });
        try {
            const { currentPage, limit, searchTerm } = get();
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                search: searchTerm,
            });

            const response = await api.get(`TestConfiguration?${queryParams}`);

            set({
                configurations: response?.data?.data?.testconfigurations,
                totalConfigurationPages: response?.data?.data?.pagination?.totalPages,
                totalConfigurationsCount: response?.data?.data?.pagination?.totalRecords,
                loading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch configurations', loading: false });
        }
    },
    fetchConfigurationByRoleIdTestId: async (roleId: string, testId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`TestConfiguration/by-role-test?roleId=${roleId}&testId=${testId}`);
            const data = response.data;

            set({ currentConfiguration: data.data, loading: false });

            //Return value matching the declared type
            return {
                code: data.statusCode || 200,
                message: data.message || 'Success',
                data: {
                    testConfiguration: data.data.testConfiguration || {},
                },
            };
        } catch (error) {
            set({ error: 'Failed to fetch configuration', loading: false });

            // ✅ Return a structured error object (keeps promise consistent)
            return {
                code: 500,
                message: 'Failed to fetch configuration',
                data: {
                    testConfiguration: {},
                },
            };
        }
    },

    fetchConfigurationById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`TestConfiguration/GetById/${id}`);
            set({ currentConfiguration: response?.data?.data?.testConfiguration, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch configuration', loading: false });
        }
    },

    createConfiguration: async (config: TestConfiguration) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('TestConfiguration', config);
            set({ loading: false });
            return response.data;
        } catch (error) {
            set({ error: 'Failed to create configuration', loading: false });
            throw error;
        }
    },

    updateConfiguration: async (id: string, config: Partial<TestConfiguration>) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`TestConfiguration/${id}`, config);
            set({ currentConfiguration: response.data, loading: false });
        } catch (error) {
            set({ error: 'Failed to update configuration', loading: false });
            throw error;
        }
    },

    deleteConfiguration: async () => {
        const { deleteId } = get();
        if (!deleteId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`TestConfiguration/delete/${deleteId}`);
            get().fetchConfigurations();
            set({ deleteOpen: false, deleteId: null, loading: false });
        } catch (error) {
            set({ error: 'Failed to delete configuration', loading: false });
            throw error;
        }
    },

    checkTestConfigurationByRole: async (testId: string, roleId: string) => {
        // Implementation for checking test configuration by role
        // Add your API call logic here
        console.log(`Checking configuration for test ${testId} and role ${roleId}`);
    },

    // UI State Management
    clearCurrentConfiguration: () => set({ currentConfiguration: null }),
    openDeleteDialog: (id: string) => set({ deleteId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
}));