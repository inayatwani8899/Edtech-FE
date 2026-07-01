import { create } from 'zustand';
import api from '@/api/axios';
import { QuestionBankItem } from '@/types/types';

interface QuestionBankState {
  questions: QuestionBankItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  expandedId: string | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setExpandedId: (id: string | null) => void;
  fetchQuestions: () => Promise<void>;
}

let fetchQBController: AbortController | null = null;

export const useQuestionBankStore = create<QuestionBankState>((set, get) => ({
  questions: [],
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  totalPages: 1,
  totalCount: 0,
  expandedId: null,

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchQuestions();
  },

  setLimit: (limit) => {
    set({ limit, currentPage: 1 });
    get().fetchQuestions();
  },

  setExpandedId: (id) => set({ expandedId: id }),

  fetchQuestions: async () => {
    if (fetchQBController) fetchQBController.abort();
    fetchQBController = new AbortController();
    const ctrl = fetchQBController;

    set({ loading: true, error: null });
    const { currentPage, limit } = get();

    try {
      const response = await api.get('/SuperAdmin/question-bank', {
        params: { page: currentPage, limit },
        signal: ctrl.signal,
      });

      if (ctrl !== fetchQBController) return;

      const data = response.data?.data ?? response.data;
      const questions: QuestionBankItem[] =
        data?.questions ?? data?.data ?? (Array.isArray(data) ? data : []);
      const pagination = data?.pagination ?? {};
      const totalCount = pagination.totalRecords ?? data?.totalCount ?? questions.length;
      const totalPages = pagination.totalPages ?? (Math.ceil(totalCount / limit) || 1);

      set({ questions, totalCount, totalPages });
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl === fetchQBController) {
        const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to fetch question bank.';
        set({ error: msg, questions: [], totalPages: 1, totalCount: 0 });
      }
    } finally {
      if (ctrl === fetchQBController) set({ loading: false });
    }
  },
}));
