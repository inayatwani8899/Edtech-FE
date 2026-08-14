import { create } from 'zustand';
import api from '@/api/axios';
import { PsychometricTheory, PsychometricTheoryFormData } from '@/types/psychometricTheory';

let fetchTheoriesController: AbortController | null = null;

interface PsychometricTheoryState {
    // State
    theories: PsychometricTheory[];
    currentTheory: PsychometricTheory | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    selectedCategoryId: string;
    deleteId: string | null;
    deleteOpen: boolean;
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;

    // Actions
    setSearchTerm: (term: string) => void;
    setSelectedCategoryId: (categoryId: string) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // CRUD Operations
    fetchTheories: () => Promise<void>;
    fetchTheoriesByCategory: (categoryId: string) => Promise<void>;
    fetchTheoryById: (id: string) => Promise<PsychometricTheory | null>;
    createTheory: (data: PsychometricTheoryFormData) => Promise<any>;
    updateTheory: (id: string, data: Partial<PsychometricTheoryFormData>) => Promise<any>;
    deleteTheory: () => Promise<void>;

    // UI State Management
    clearCurrentTheory: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;
}

// Normalizer to handle any backend response variations safely
export const normaliseTheory = (raw: Record<string, any>): PsychometricTheory => {
    let catName = '';
    let catId: string | number | null = null;

    if (raw.category) {
        if (typeof raw.category === 'string') {
            catName = raw.category;
        } else if (typeof raw.category === 'object') {
            catName = raw.category.categoryName || raw.category.name || '';
            catId = raw.category.id || raw.category.categoryId || null;
        }
    }
    if (!catName && raw.categoryName) catName = raw.categoryName;
    if (!catId && raw.categoryId) catId = raw.categoryId;

    return {
        id: String(raw.id ?? raw._id ?? raw.theoryId ?? ""),
        theoryName: (raw.theoryName as string) ?? (raw.name as string) ?? (raw.title as string) ?? "",
        description: (raw.description as string) ?? "",
        categoryId: catId ? String(catId) : undefined,
        categoryName: catName || undefined,
        category: raw.category,
        isActive: raw.isActive !== false,
        createdAt: raw.createdAt as string | undefined,
        updatedAt: raw.updatedAt as string | undefined,
    };
};

export const usePsychometricTheoryStore = create<PsychometricTheoryState>((set, get) => ({
    // Initial State
    theories: [],
    currentTheory: null,
    loading: false,
    error: null,
    searchTerm: "",
    selectedCategoryId: "all",
    deleteId: null,
    deleteOpen: false,
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,

    // Actions
    setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
    setSelectedCategoryId: (categoryId: string) => set({ selectedCategoryId: categoryId, currentPage: 1 }),
    setPage: (page: number) => set({ currentPage: page }),
    setLimit: (limit: number) => set({ limit, currentPage: 1 }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    // Fetch All Theories or Filtered Theories
    fetchTheories: async () => {
        if (fetchTheoriesController) fetchTheoriesController.abort();
        fetchTheoriesController = new AbortController();
        const ctrl = fetchTheoriesController;

        set({ loading: true, error: null });
        try {
            const { selectedCategoryId } = get();

            let endpoint = 'PsychometricTheory';
            if (selectedCategoryId && selectedCategoryId !== 'all') {
                endpoint = `PsychometricTheory/category/${selectedCategoryId}`;
            }

            const response = await api.get(endpoint, { signal: ctrl.signal });
            if (ctrl !== fetchTheoriesController) return;

            const resData = response.data?.data ?? response.data;
            const rawList: Record<string, any>[] = Array.isArray(resData)
                ? resData
                : resData?.theories ?? resData?.data ?? resData?.items ?? [];

            let normalizedList = rawList.map(normaliseTheory);

            // Apply search filter if present
            const { searchTerm, limit, currentPage } = get();
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                normalizedList = normalizedList.filter(
                    t => t.theoryName.toLowerCase().includes(q) ||
                         t.description.toLowerCase().includes(q) ||
                         (t.categoryName && t.categoryName.toLowerCase().includes(q))
                );
            }

            const total = normalizedList.length;
            const pages = Math.ceil(total / limit) || 1;

            set({
                theories: normalizedList,
                totalCount: total,
                totalPages: pages,
                loading: false
            });
        } catch (error: any) {
            if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
            if (ctrl === fetchTheoriesController) {
                // Fallback attempt: if category filtering endpoint had a structural difference, try GET /PsychometricTheory
                try {
                    const fallbackRes = await api.get('PsychometricTheory', { signal: ctrl.signal });
                    const resData = fallbackRes.data?.data ?? fallbackRes.data;
                    const rawList: Record<string, any>[] = Array.isArray(resData)
                        ? resData
                        : resData?.theories ?? resData?.data ?? [];
                    let normalizedList = rawList.map(normaliseTheory);

                    const { selectedCategoryId, searchTerm, limit } = get();
                    if (selectedCategoryId && selectedCategoryId !== 'all') {
                        normalizedList = normalizedList.filter(
                            t => String(t.categoryId) === String(selectedCategoryId) ||
                                 (t.categoryName && t.categoryName.toLowerCase().includes(selectedCategoryId.toLowerCase()))
                        );
                    }
                    if (searchTerm.trim()) {
                        const q = searchTerm.toLowerCase();
                        normalizedList = normalizedList.filter(
                            t => t.theoryName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
                        );
                    }

                    const total = normalizedList.length;
                    const pages = Math.ceil(total / limit) || 1;

                    set({
                        theories: normalizedList,
                        totalCount: total,
                        totalPages: pages,
                        loading: false,
                        error: null
                    });
                    return;
                } catch (fallbackErr) {
                    // Ignore fallback failure
                }

                const msg = error.response?.data?.message || 'Failed to fetch psychometric theories';
                set({
                    error: msg,
                    loading: false
                });
            }
        }
    },

    // Fetch Theories by Category Endpoint
    fetchTheoriesByCategory: async (categoryId: string) => {
        set({ selectedCategoryId: categoryId, currentPage: 1 });
        await get().fetchTheories();
    },

    // Get Theory By ID
    fetchTheoryById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`PsychometricTheory/${id}`);
            const raw = response.data?.data ?? response.data;
            const theory = normaliseTheory(raw);
            set({
                currentTheory: theory,
                loading: false
            });
            return theory;
        } catch (error: any) {
            const msg = error.response?.data?.message || `Failed to fetch theory #${id}`;
            set({
                error: msg,
                loading: false
            });
            return null;
        }
    },

    // Create Theory
    createTheory: async (formData: PsychometricTheoryFormData) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                theoryName: formData.theoryName.trim(),
                name: formData.theoryName.trim(),
                description: formData.description.trim(),
                categoryId: formData.categoryId ? Number(formData.categoryId) || formData.categoryId : undefined,
                isActive: formData.isActive !== false,
            };

            const response = await api.post('PsychometricTheory', payload);
            set({ loading: false });
            await get().fetchTheories();
            return response.data;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to create psychometric theory';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // Update Theory
    updateTheory: async (id: string, formData: Partial<PsychometricTheoryFormData>) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                id: Number(id) || id,
                theoryName: formData.theoryName?.trim(),
                name: formData.theoryName?.trim(),
                description: formData.description?.trim(),
                categoryId: formData.categoryId ? Number(formData.categoryId) || formData.categoryId : undefined,
                isActive: formData.isActive !== false,
            };

            const response = await api.put(`PsychometricTheory/${id}`, payload);
            const raw = response.data?.data ?? response.data;
            if (raw && typeof raw === 'object') {
                set({ currentTheory: normaliseTheory(raw) });
            }
            set({ loading: false });
            await get().fetchTheories();
            return response.data;
        } catch (error: any) {
            const msg = error.response?.data?.message || `Failed to update theory #${id}`;
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // Delete Theory
    deleteTheory: async () => {
        const { deleteId } = get();
        if (!deleteId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`PsychometricTheory/${deleteId}`);
            set({ deleteOpen: false, deleteId: null, loading: false });
            await get().fetchTheories();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to delete theory';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // UI Management
    clearCurrentTheory: () => set({ currentTheory: null }),
    openDeleteDialog: (id: string) => set({ deleteId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
}));
