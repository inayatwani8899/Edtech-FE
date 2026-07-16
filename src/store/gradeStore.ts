import { create } from 'zustand';
import api from '@/api/axios';
import { Grade } from '@/types/types';

interface GradeState {
  // List state
  grades: Grade[];
  currentGrade: Grade | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  debouncedSearchTerm: string;

  // Delete dialog state
  deleteId: string | null;
  deleteOpen: boolean;

  // Actions
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortDirection: (dir: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  clearCurrentGrade: () => void;

  // CRUD
  fetchGrades: () => Promise<void>;
  fetchGradeById: (id: string) => Promise<void>;
  createGrade: (data: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGrade: (id: string, data: Partial<Grade>) => Promise<void>;
  deleteGrade: () => Promise<void>;
}

let fetchGradesController: AbortController | null = null;
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

/** Maps the raw backend payload to the canonical frontend Grade shape. */
const normaliseGrade = (raw: Record<string, unknown>): Grade => ({
  id: String(raw.id ?? raw._id ?? ''),
  gradeName: (raw.gradeName as string) ?? (raw.name as string) ?? '',
  description: (raw.description as string) ?? '',
  isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : true,
  createdAt: raw.createdAt as string | undefined,
  updatedAt: raw.updatedAt as string | undefined,
});

export const useGradeStore = create<GradeState>((set, get) => ({
  grades: [],
  currentGrade: null,
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  totalCount: 0,
  sortDirection: 'asc',
  searchTerm: '',
  debouncedSearchTerm: '',
  deleteId: null,
  deleteOpen: false,

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchGrades();
  },

  setLimit: (limit) => {
    set({ limit, currentPage: 1 });
    get().fetchGrades();
  },

  setSortDirection: (dir) => {
    set({ sortDirection: dir, currentPage: 1 });
    get().fetchGrades();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      set({ debouncedSearchTerm: term, currentPage: 1 });
      get().fetchGrades();
    }, 500);
  },

  openDeleteDialog: (id) => set({ deleteId: id, deleteOpen: true }),
  closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),
  clearCurrentGrade: () => set({ currentGrade: null, error: null }),

  fetchGrades: async () => {
    if (fetchGradesController) fetchGradesController.abort();
    fetchGradesController = new AbortController();
    const ctrl = fetchGradesController;

    set({ loading: true, error: null });
    const { currentPage, limit, sortDirection, debouncedSearchTerm } = get();

    try {
      const response = await api.get('/Grade', {
        params: {
          page: currentPage,
          limit,
          sortDirection,
          ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
        },
        signal: ctrl.signal,
      });

      if (ctrl !== fetchGradesController) return;

      const data = response.data?.data ?? response.data;
      const rawList: Record<string, unknown>[] =
        data?.grades ?? data?.data ?? (Array.isArray(data) ? data : []);
      const gradesList: Grade[] = rawList.map(normaliseGrade);
      const pagination = data?.pagination ?? {};
      const totalCount = pagination.totalRecords ?? data?.totalCount ?? gradesList.length;
      const totalPages = pagination.totalPages ?? (Math.ceil(totalCount / limit) || 1);

      set({ grades: gradesList, totalCount, totalPages });
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl === fetchGradesController) {
        const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch grades.';
        set({ error: msg, grades: [], totalPages: 1, totalCount: 0 });
      }
    } finally {
      if (ctrl === fetchGradesController) set({ loading: false });
    }
  },

  fetchGradeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/Grade/${id}`);
      const raw: Record<string, unknown> = response.data?.data ?? response.data;
      set({ currentGrade: normaliseGrade(raw), loading: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch grade.';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  createGrade: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/Grade/create', data);
      set({ loading: false });
      await get().fetchGrades();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to create grade.';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  updateGrade: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/Grade/${id}`, { ...data, id });
      set({ loading: false });
      await get().fetchGrades();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to update grade.';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  deleteGrade: async () => {
    const { deleteId, grades, currentPage } = get();
    if (!deleteId) return;

    set({ loading: true, error: null });
    try {
      await api.delete(`/Grade/${deleteId}`);

      // Step back one page if last item on page is removed
      const remaining = grades.filter((g) => g.id !== deleteId);
      if (remaining.length === 0 && currentPage > 1) set({ currentPage: currentPage - 1 });

      set({ deleteOpen: false, deleteId: null });
      await get().fetchGrades();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to delete grade.';
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
