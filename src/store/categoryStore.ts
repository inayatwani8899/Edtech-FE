// stores/categoryStore.ts
import { create } from 'zustand';
import api from '@/api/axios';
import { Category } from '@/types/types';

let fetchCategoriesController: AbortController | null = null;

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
    createCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<unknown>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
    deleteCategory: () => Promise<void>;
    fetchCategoryByName: (name: string) => Promise<{ code: number, message: string, data: { category: Category | null } }>;

    // UI State Management
    clearCurrentCategory: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;
}

// Helper function to map raw API responses to the frontend Category interface
const normaliseCategory = (raw: Record<string, unknown>): Category => ({
    id: String(raw.id ?? raw._id ?? ""),
    categoryName: (raw.categoryName as string) ?? (raw.name as string) ?? "",
    description: (raw.description as string) ?? "",
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
});

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
        if (fetchCategoriesController) fetchCategoriesController.abort();
        fetchCategoriesController = new AbortController();
        const ctrl = fetchCategoriesController;

        set({ loading: true, error: null });
        try {
            const { currentPage, limit, searchTerm } = get();
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                sortDirection: 'desc',
                ...(searchTerm ? { search: searchTerm } : {}),
            });

            const response = await api.get(`Category?${queryParams}`, { signal: ctrl.signal });
            if (ctrl !== fetchCategoriesController) return;

            const data = response.data?.data ?? response.data;
            const rawList: Record<string, unknown>[] = data?.categories ?? data?.data ?? (Array.isArray(data) ? data : []);
            const categoriesList = rawList.map(normaliseCategory);
            const pagination = data?.pagination ?? {};
            const totalCount = pagination.totalRecords ?? data?.totalCount ?? categoriesList.length;
            const totalPages = pagination.totalPages ?? (Math.ceil(totalCount / limit) || 1);

            set({
                categories: categoriesList,
                totalCategoryPages: totalPages,
                totalCategoriesCount: totalCount,
                totalPages: totalPages,
                loading: false
            });
        } catch (error: unknown) {
            if ((error as { name?: string })?.name === 'CanceledError' || (error as { code?: string })?.code === 'ERR_CANCELED') return;
            if (ctrl === fetchCategoriesController) {
                const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch categories';
                set({
                    error: msg,
                    loading: false
                });
            }
        }
    },

    fetchCategoryById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`Category/${id}`);
            const raw = (response.data?.data ?? response.data) as Record<string, unknown>;
            set({
                currentCategory: normaliseCategory(raw),
                loading: false
            });
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch category';
            set({
                error: msg,
                loading: false
            });
        }
    },

    fetchCategoryByName: async (name: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`Category/by-name?name=${encodeURIComponent(name)}`);
            const data = response.data;
            const raw = (data.data?.category || data.data || null) as Record<string, unknown> | null;
            const category = raw ? normaliseCategory(raw) : null;

            set({ currentCategory: category, loading: false });

            // Return value matching the declared type
            return {
                code: data.statusCode || 200,
                message: data.message || 'Success',
                data: {
                    category,
                },
            };
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch category by name';
            const status = (error as { response?: { status?: number } }).response?.status ?? 500;
            set({
                error: msg,
                loading: false
            });

            // Return a structured error object
            return {
                code: status,
                message: msg,
                data: {
                    category: null,
                },
            };
        }
    },

    createCategory: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                name: categoryData.categoryName,
                description: categoryData.description,
                isActive: categoryData.isActive !== false,
            };
            const response = await api.post('Category', payload);
            set({ loading: false });
            return response.data;
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to create category';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    updateCategory: async (id: string, categoryData: Partial<Category>) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                name: categoryData.categoryName,
                description: categoryData.description,
                isActive: categoryData.isActive !== false,
            };
            const response = await api.put(`Category/${id}`, payload);
            const raw = (response.data?.data ?? response.data) as Record<string, unknown>;
            set({
                currentCategory: normaliseCategory(raw),
                loading: false
            });
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to update category';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    deleteCategory: async () => {
        const { deleteId, categories, currentPage } = get();
        if (!deleteId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`Category/${deleteId}`);
            
            const remaining = categories.filter((c) => c.id !== deleteId);
            if (remaining.length === 0 && currentPage > 1) {
                set({ currentPage: currentPage - 1 });
            }

            set({ deleteOpen: false, deleteId: null });
            await get().fetchCategories();
        } catch (error: unknown) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to delete category';
            set({
                error: msg,
                loading: false
            });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    // UI State Management
    clearCurrentCategory: () => set({ currentCategory: null }),
    openDeleteDialog: (id: string) => set({ deleteId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
}));