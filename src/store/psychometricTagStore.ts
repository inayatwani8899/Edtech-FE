import { create } from 'zustand';
import api from '@/api/axios';
import { PsychometricTag, PsychometricTagFormData } from '@/types/psychometricTag';

let fetchTagsController: AbortController | null = null;

interface PsychometricTagState {
    // State
    tags: PsychometricTag[];
    currentTag: PsychometricTag | null;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    selectedTheoryId: string;
    deleteId: string | null;
    deleteOpen: boolean;
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;

    // Actions
    setSearchTerm: (term: string) => void;
    setSelectedTheoryId: (theoryId: string) => void;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // CRUD Operations
    fetchTags: () => Promise<void>;
    fetchTagsByTheory: (theoryId: string) => Promise<void>;
    fetchTagById: (id: string) => Promise<PsychometricTag | null>;
    createTag: (data: PsychometricTagFormData) => Promise<any>;
    updateTag: (id: string, data: Partial<PsychometricTagFormData>) => Promise<any>;
    deleteTag: () => Promise<void>;

    // UI State Management
    clearCurrentTag: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;
}

// Normalizer helper for robust API response mapping
export const normaliseTag = (raw: Record<string, any>): PsychometricTag => {
    let tName = '';
    let tId: string | number | null = null;

    if (raw.theory) {
        if (typeof raw.theory === 'string') {
            tName = raw.theory;
        } else if (typeof raw.theory === 'object') {
            tName = raw.theory.theoryName || raw.theory.name || '';
            tId = raw.theory.id || raw.theory.theoryId || null;
        }
    }
    if (!tName && raw.theoryName) tName = raw.theoryName;
    if (!tId && raw.theoryId) tId = raw.theoryId;

    return {
        id: String(raw.id ?? raw._id ?? raw.tagId ?? ""),
        tagName: (raw.tagName as string) ?? (raw.name as string) ?? (raw.title as string) ?? "",
        description: (raw.description as string) ?? "",
        theoryId: tId ? String(tId) : undefined,
        theoryName: tName || undefined,
        theory: raw.theory,
        isActive: raw.isActive !== false,
        createdAt: raw.createdAt as string | undefined,
        updatedAt: raw.updatedAt as string | undefined,
    };
};

export const usePsychometricTagStore = create<PsychometricTagState>((set, get) => ({
    // Initial State
    tags: [],
    currentTag: null,
    loading: false,
    error: null,
    searchTerm: "",
    selectedTheoryId: "all",
    deleteId: null,
    deleteOpen: false,
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,

    // Actions
    setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
    setSelectedTheoryId: (theoryId: string) => set({ selectedTheoryId: theoryId, currentPage: 1 }),
    setPage: (page: number) => set({ currentPage: page }),
    setLimit: (limit: number) => set({ limit, currentPage: 1 }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),

    // Fetch All Tags or Filtered Tags by Theory
    fetchTags: async () => {
        if (fetchTagsController) fetchTagsController.abort();
        fetchTagsController = new AbortController();
        const ctrl = fetchTagsController;

        set({ loading: true, error: null });
        try {
            const { selectedTheoryId } = get();

            let endpoint = 'PsychometricTag';
            if (selectedTheoryId && selectedTheoryId !== 'all') {
                endpoint = `PsychometricTag/theory/${selectedTheoryId}`;
            }

            const response = await api.get(endpoint, { signal: ctrl.signal });
            if (ctrl !== fetchTagsController) return;

            const resData = response.data?.data ?? response.data;
            const rawList: Record<string, any>[] = Array.isArray(resData)
                ? resData
                : resData?.tags ?? resData?.data ?? resData?.items ?? [];

            let normalizedList = rawList.map(normaliseTag);

            // Search Filter
            const { searchTerm, limit } = get();
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase();
                normalizedList = normalizedList.filter(
                    t => t.tagName.toLowerCase().includes(q) ||
                         t.description.toLowerCase().includes(q) ||
                         (t.theoryName && t.theoryName.toLowerCase().includes(q))
                );
            }

            const total = normalizedList.length;
            const pages = Math.ceil(total / limit) || 1;

            set({
                tags: normalizedList,
                totalCount: total,
                totalPages: pages,
                loading: false
            });
        } catch (error: any) {
            if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
            if (ctrl === fetchTagsController) {
                // Fallback: If theory specific endpoint had a structural difference, try GET /PsychometricTag and filter client side
                try {
                    const fallbackRes = await api.get('PsychometricTag', { signal: ctrl.signal });
                    const resData = fallbackRes.data?.data ?? fallbackRes.data;
                    const rawList: Record<string, any>[] = Array.isArray(resData)
                        ? resData
                        : resData?.tags ?? resData?.data ?? [];
                    let normalizedList = rawList.map(normaliseTag);

                    const { selectedTheoryId, searchTerm, limit } = get();
                    if (selectedTheoryId && selectedTheoryId !== 'all') {
                        normalizedList = normalizedList.filter(
                            t => String(t.theoryId) === String(selectedTheoryId) ||
                                 (t.theoryName && t.theoryName.toLowerCase().includes(selectedTheoryId.toLowerCase()))
                        );
                    }
                    if (searchTerm.trim()) {
                        const q = searchTerm.toLowerCase();
                        normalizedList = normalizedList.filter(
                            t => t.tagName.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
                        );
                    }

                    const total = normalizedList.length;
                    const pages = Math.ceil(total / limit) || 1;

                    set({
                        tags: normalizedList,
                        totalCount: total,
                        totalPages: pages,
                        loading: false,
                        error: null
                    });
                    return;
                } catch (fallbackErr) {
                    // Ignore fallback failure
                }

                const msg = error.response?.data?.message || 'Failed to fetch psychometric tags';
                set({
                    error: msg,
                    loading: false
                });
            }
        }
    },

    // Fetch Tags by Theory
    fetchTagsByTheory: async (theoryId: string) => {
        set({ selectedTheoryId: theoryId, currentPage: 1 });
        await get().fetchTags();
    },

    // Get Tag By ID
    fetchTagById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`PsychometricTag/${id}`);
            const raw = response.data?.data ?? response.data;
            const tag = normaliseTag(raw);
            set({
                currentTag: tag,
                loading: false
            });
            return tag;
        } catch (error: any) {
            const msg = error.response?.data?.message || `Failed to fetch tag #${id}`;
            set({
                error: msg,
                loading: false
            });
            return null;
        }
    },

    // Create Tag
    createTag: async (formData: PsychometricTagFormData) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                tagName: formData.tagName.trim(),
                name: formData.tagName.trim(),
                description: formData.description.trim(),
                theoryId: formData.theoryId ? Number(formData.theoryId) || formData.theoryId : undefined,
                isActive: formData.isActive !== false,
            };

            const response = await api.post('PsychometricTag', payload);
            set({ loading: false });
            await get().fetchTags();
            return response.data;
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to create psychometric tag';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // Update Tag
    updateTag: async (id: string, formData: Partial<PsychometricTagFormData>) => {
        set({ loading: true, error: null });
        try {
            const payload = {
                id: Number(id) || id,
                tagName: formData.tagName?.trim(),
                name: formData.tagName?.trim(),
                description: formData.description?.trim(),
                theoryId: formData.theoryId ? Number(formData.theoryId) || formData.theoryId : undefined,
                isActive: formData.isActive !== false,
            };

            const response = await api.put(`PsychometricTag/${id}`, payload);
            const raw = response.data?.data ?? response.data;
            if (raw && typeof raw === 'object') {
                set({ currentTag: normaliseTag(raw) });
            }
            set({ loading: false });
            await get().fetchTags();
            return response.data;
        } catch (error: any) {
            const msg = error.response?.data?.message || `Failed to update tag #${id}`;
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // Delete Tag
    deleteTag: async () => {
        const { deleteId } = get();
        if (!deleteId) return;

        set({ loading: true, error: null });
        try {
            await api.delete(`PsychometricTag/${deleteId}`);
            set({ deleteOpen: false, deleteId: null, loading: false });
            await get().fetchTags();
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to delete tag';
            set({
                error: msg,
                loading: false
            });
            throw error;
        }
    },

    // UI Management
    clearCurrentTag: () => set({ currentTag: null }),
    openDeleteDialog: (id: string) => set({ deleteId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
}));
