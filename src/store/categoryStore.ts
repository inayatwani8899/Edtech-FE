// stores/categoryStore.ts
import { create } from 'zustand';
import api from '@/api/axios';
import { Category } from '@/types/types';

interface CategoryState {
    // State
    categories: Category[];
    currentCategory: Category | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    deleteId: string | null;
    deleteOpen: boolean;
    currentPage: number;
    limit: number;
    totalCategoryPages: number | null;
    totalCategoriesCount: number | null;
    totalPages: number;

    // Actions
    setSearchTerm: (term: string) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Category CRUD Operations
    fetchCategories: () => Promise<void>;
    fetchCategoryById: (id: string) => Promise<void>;
    createCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: () => Promise<void>;
    fetchCategoryByName: (name: string) => Promise<{ code: number, message: string, data: { category: Category | null } }>;

    // UI State Management
    clearCurrentCategory: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    // Initial state
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
    searchTerm: "",
    deleteId: null,
    deleteOpen: false,
    currentPage: 1,
    limit: 5,
    totalCategoryPages: null,
    totalCategoriesCount: null,
    totalPages: 1,

    // Actions
    setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
    setPage: (page: number) => set({ currentPage: page }),
    setLimit: (limit: number) => set({ limit, currentPage: 1 }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    // Category CRUD Operations
    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const { currentPage, limit, searchTerm } = get();
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                search: searchTerm,
            });

            const response = await api.get(`Category?${queryParams}`);

            set({
                categories: response?.data?.categories || response?.data?.data?.categories,
                totalCategoryPages: response?.data?.data?.pagination?.totalPages,
                totalCategoriesCount: response?.data?.data?.pagination?.totalRecords,
                totalPages: response?.data?.data?.pagination?.totalPages || 1,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch categories',
                loading: false
            });
        }
    },

    fetchCategoryById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`Category/${id}`);
            set({
                currentCategory: response.data.data || response.data.category,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch category',
                loading: false
            });
        }
    },

    fetchCategoryByName: async (name: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`Category/by-name?name=${encodeURIComponent(name)}`);
            const data = response.data;

            set({ currentCategory: data.data, loading: false });

            // Return value matching the declared type
            return {
                code: data.statusCode || 200,
                message: data.message || 'Success',
                data: {
                    category: data.data?.category || data.data || null,
                },
            };
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch category by name',
                loading: false
            });

            // Return a structured error object
            return {
                code: error.response?.status || 500,
                message: error.response?.data?.message || 'Failed to fetch category by name',
                data: {
                    category: null,
                },
            };
        }
    },

    createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ loading: true, error: null });
        try {
            const response = await api.post('Category/create', categoryData);
            set({ loading: false });
            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create category',
                loading: false
            });
            throw error;
        }
    },

    updateCategory: async (id: string, categoryData: Partial<Category>) => {
        set({ loading: true, error: null });
        categoryData.id = id;
        try {
            const response = await api.put(`Category`, categoryData);
            set({
                currentCategory: response.data.data || response.data,
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update category',
                loading: false
            });
            throw error;
        }
    },

    deleteCategory: async () => {
        const { deleteId } = get();
        if (!deleteId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`Category/${deleteId}`);
            // Refresh the categories list after deletion
            get().fetchCategories();
            set({ deleteOpen: false, deleteId: null, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete category',
                loading: false
            });
            throw error;
        }
    },

    // UI State Management
    clearCurrentCategory: () => set({ currentCategory: null }),
    openDeleteDialog: (id: string) => set({ deleteId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
}));