import { create } from 'zustand';
import api from '@/api/axios';
import { Grade, Category, Test } from '@/types/types';

export interface QuestionOptionAdmin {
  id?: string | number;
  option_Id?: string | number;
  optionText: string;
  score: number;
  isCorrect: boolean;
}

export interface QuestionAdmin {
  id: string;
  questionText: string;
  testId: string | number;
  testName?: string;
  categoryId: string | number;
  categoryName?: string;
  theoryId: string | number;
  theoryName?: string;
  tagId: string | number;
  tagName?: string;
  gradeId: string | number;
  gradeName?: string;
  isActive: boolean;
  createdAt?: string;
  options: QuestionOptionAdmin[];
}

export interface PsychometricTheory {
  id: string | number;
  theoryName: string;
  description?: string;
}

export interface PsychometricTag {
  id: string | number;
  tagName: string;
  description?: string;
}

interface QuestionFilters {
  testId: string;
  categoryId: string;
  theoryId: string;
  tagId: string;
  gradeId: string;
  isActive: string; // 'all' | 'true' | 'false'
}

interface QuestionState {
  questions: QuestionAdmin[];
  currentQuestion: QuestionAdmin | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // Pagination & Sorting & Searching
  currentPage: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  debouncedSearchTerm: string;

  // Filters State
  filters: QuestionFilters;

  // Cascading lists
  tests: Test[];
  grades: Grade[];
  categories: Category[];
  theories: PsychometricTheory[];
  tags: PsychometricTag[];

  loadingTests: boolean;
  loadingGrades: boolean;
  loadingCategories: boolean;
  loadingTheories: boolean;
  loadingTags: boolean;

  // Form-specific lists (to avoid mixing with filter selections)
  formCategories: Category[];
  formTheories: PsychometricTheory[];
  formTags: PsychometricTag[];

  loadingFormCategories: boolean;
  loadingFormTheories: boolean;
  loadingFormTags: boolean;

  // Dialog / Delete state
  deleteId: string | null;
  deleteOpen: boolean;

  // Base Setters
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sortBy: string, direction: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;
  clearCurrentQuestion: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;

  // Cascading setters
  setFilterTestId: (testId: string) => Promise<void>;
  setFilterCategoryId: (categoryId: string) => Promise<void>;
  setFilterTheoryId: (theoryId: string) => Promise<void>;
  setFilterTagId: (tagId: string) => void;
  setFilterGradeId: (gradeId: string) => void;
  setFilterIsActive: (isActive: string) => void;
  resetFilters: () => void;

  // Form cascading loaders
  loadFormCategories: (testId: string) => Promise<void>;
  loadFormTheories: (categoryId: string) => Promise<void>;
  loadFormTags: (theoryId: string) => Promise<void>;
  clearFormCascading: () => void;

  // Global Lookups
  fetchTests: () => Promise<void>;
  fetchGrades: () => Promise<void>;

  // CRUD Actions
  fetchQuestions: () => Promise<void>;
  fetchQuestionById: (id: string) => Promise<void>;
  createQuestion: (data: Omit<QuestionAdmin, 'id'>) => Promise<void>;
  updateQuestion: (id: string, data: Partial<QuestionAdmin>) => Promise<void>;
  deleteQuestion: () => Promise<void>;
}

let fetchQuestionsController: AbortController | null = null;
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

let loadCategoriesController: AbortController | null = null;
let loadTheoriesController: AbortController | null = null;
let loadTagsController: AbortController | null = null;

// Helpers to extract list from wrapper formats
const extractList = (response: unknown, key: string): Record<string, unknown>[] => {
  if (!response || typeof response !== 'object') return [];
  const resObj = response as Record<string, unknown>;
  const body = resObj.data as Record<string, unknown> | undefined;
  const data = body?.data ?? body ?? resObj;
  if (!data) return [];
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (typeof data === 'object') {
    const dataObj = data as Record<string, unknown>;
    if (dataObj[key] && Array.isArray(dataObj[key])) return dataObj[key] as Record<string, unknown>[];
    if (dataObj.data && Array.isArray(dataObj.data)) return dataObj.data as Record<string, unknown>[];
  }
  return [];
};

const normaliseCategory = (raw: Record<string, unknown>): Category => ({
  id: String(raw.id ?? raw._id ?? ""),
  categoryName: (raw.categoryName as string) ?? (raw.name as string) ?? "",
  description: (raw.description as string) ?? "",
  isActive: raw.isActive !== false,
  createdAt: raw.createdAt as string | undefined,
  updatedAt: raw.updatedAt as string | undefined,
});

const normaliseTheory = (raw: Record<string, unknown>): PsychometricTheory => ({
  id: String(raw.id ?? raw._id ?? ""),
  theoryName: (raw.theoryName as string) ?? (raw.name as string) ?? "",
  description: (raw.description as string) ?? "",
});

const normaliseTag = (raw: Record<string, unknown>): PsychometricTag => ({
  id: String(raw.id ?? raw._id ?? ""),
  tagName: (raw.tagName as string) ?? (raw.name as string) ?? "",
  description: (raw.description as string) ?? "",
});

const normaliseGrade = (raw: Record<string, unknown>): Grade => ({
  id: String(raw.id ?? raw._id ?? ""),
  gradeName: (raw.gradeName as string) ?? (raw.name as string) ?? "",
  description: (raw.description as string) ?? "",
  isActive: raw.isActive !== false,
  createdAt: raw.createdAt as string | undefined,
  updatedAt: raw.updatedAt as string | undefined,
});

const normaliseQuestion = (raw: Record<string, unknown>): QuestionAdmin => {
  // Option mapping helper
  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const options: QuestionOptionAdmin[] = rawOptions.map((item: unknown) => {
    const o = item as Record<string, unknown>;
    return {
      id: (o.id ?? o.option_Id ?? o.optionId) as string | number | undefined,
      optionText: (o.optionText ?? o.option_Text ?? '') as string,
      score: Number(o.score ?? 0),
      isCorrect: o.isCorrect !== undefined ? Boolean(o.isCorrect) : false,
    };
  });

  return {
    id: String(raw.id ?? raw.question_Id ?? raw.questionId ?? ''),
    questionText: String(raw.questionText ?? raw.question_Text ?? ''),
    testId: String(raw.testId ?? raw.test_Id ?? ''),
    testName: (raw.testName ?? (raw.test as { title?: string })?.title ?? '') as string,
    categoryId: String(raw.categoryId ?? raw.category_Id ?? ''),
    categoryName: (raw.categoryName ?? (raw.category as { categoryName?: string })?.categoryName ?? '') as string,
    theoryId: String(raw.theoryId ?? raw.theory_Id ?? ''),
    theoryName: (raw.theoryName ?? (raw.theory as { theoryName?: string })?.theoryName ?? '') as string,
    tagId: String(raw.tagId ?? raw.tag_Id ?? ''),
    tagName: (raw.tagName ?? (raw.tag as { tagName?: string })?.tagName ?? '') as string,
    gradeId: String(raw.gradeId ?? raw.grade_Id ?? ''),
    gradeName: (raw.gradeName ?? (raw.grade as { gradeName?: string })?.gradeName ?? '') as string,
    isActive: raw.isActive !== undefined ? Boolean(raw.isActive) : true,
    createdAt: (raw.createdAt ?? raw.createdDate) as string | undefined,
    options,
  };
};

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  currentQuestion: null,
  loading: false,
  saving: false,
  error: null,

  currentPage: 1,
  limit: 10,
  totalPages: 1,
  totalCount: 0,
  sortBy: 'questiontext',
  sortDirection: 'desc',
  searchTerm: '',
  debouncedSearchTerm: '',

  filters: {
    testId: '',
    categoryId: '',
    theoryId: '',
    tagId: '',
    gradeId: '',
    isActive: 'all',
  },

  tests: [],
  grades: [],
  categories: [],
  theories: [],
  tags: [],

  loadingTests: false,
  loadingGrades: false,
  loadingCategories: false,
  loadingTheories: false,
  loadingTags: false,

  formCategories: [],
  formTheories: [],
  formTags: [],

  loadingFormCategories: false,
  loadingFormTheories: false,
  loadingFormTags: false,

  deleteId: null,
  deleteOpen: false,

  // Base Setters
  setPage: (page) => {
    set({ currentPage: page });
    get().fetchQuestions();
  },

  setLimit: (limit) => {
    set({ limit, currentPage: 1 });
    get().fetchQuestions();
  },

  setSort: (sortBy, direction) => {
    set({ sortBy, sortDirection: direction, currentPage: 1 });
    get().fetchQuestions();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      set({ debouncedSearchTerm: term, currentPage: 1 });
      get().fetchQuestions();
    }, 300);
  },

  clearCurrentQuestion: () => set({ currentQuestion: null, error: null }),
  openDeleteDialog: (id) => set({ deleteId: id, deleteOpen: true }),
  closeDeleteDialog: () => set({ deleteId: null, deleteOpen: false }),

  // Cascading setters
  setFilterTestId: async (testId) => {
    set((state) => ({
      filters: { ...state.filters, testId, categoryId: '', theoryId: '', tagId: '' },
      currentPage: 1,
      categories: [],
      theories: [],
      tags: [],
    }));

    if (testId && testId !== 'all' && testId !== 'undefined' && testId !== 'null') {
      if (loadCategoriesController) loadCategoriesController.abort();
      loadCategoriesController = new AbortController();
      set({ loadingCategories: true });
      try {
        const response = await api.get(`/Category/test/${testId}`, {
          signal: loadCategoriesController.signal,
        });
        const rawList = extractList(response, 'categories');
        const list = rawList.map(normaliseCategory);
        set({ categories: list });
      } catch (err: unknown) {
        const e = err as { name?: string };
        if (e.name !== 'CanceledError') {
          console.error('Failed to load categories for filter', err);
        }
      } finally {
        set({ loadingCategories: false });
      }
    }

    get().fetchQuestions();
  },

  setFilterCategoryId: async (categoryId) => {
    set((state) => ({
      filters: { ...state.filters, categoryId, theoryId: '', tagId: '' },
      currentPage: 1,
      theories: [],
      tags: [],
    }));

    if (categoryId && categoryId !== 'all' && categoryId !== 'undefined' && categoryId !== 'null') {
      if (loadTheoriesController) loadTheoriesController.abort();
      loadTheoriesController = new AbortController();
      set({ loadingTheories: true });
      try {
        const response = await api.get(`/PsychometricTheory/category/${categoryId}`, {
          signal: loadTheoriesController.signal,
        });
        const rawList = extractList(response, 'theories');
        const list = rawList.map(normaliseTheory);
        set({ theories: list });
      } catch (err: unknown) {
        const e = err as { name?: string };
        if (e.name !== 'CanceledError') {
          console.error('Failed to load theories for filter', err);
        }
      } finally {
        set({ loadingTheories: false });
      }
    }

    get().fetchQuestions();
  },

  setFilterTheoryId: async (theoryId) => {
    set((state) => ({
      filters: { ...state.filters, theoryId, tagId: '' },
      currentPage: 1,
      tags: [],
    }));

    if (theoryId && theoryId !== 'all' && theoryId !== 'undefined' && theoryId !== 'null') {
      if (loadTagsController) loadTagsController.abort();
      loadTagsController = new AbortController();
      set({ loadingTags: true });
      try {
        const response = await api.get(`/PsychometricTag/theory/${theoryId}`, {
          signal: loadTagsController.signal,
        });
        const rawList = extractList(response, 'tags');
        const list = rawList.map(normaliseTag);
        set({ tags: list });
      } catch (err: unknown) {
        const e = err as { name?: string };
        if (e.name !== 'CanceledError') {
          console.error('Failed to load tags for filter', err);
        }
      } finally {
        set({ loadingTags: false });
      }
    }

    get().fetchQuestions();
  },

  setFilterTagId: (tagId) => {
    set((state) => ({ filters: { ...state.filters, tagId }, currentPage: 1 }));
    get().fetchQuestions();
  },

  setFilterGradeId: (gradeId) => {
    set((state) => ({ filters: { ...state.filters, gradeId }, currentPage: 1 }));
    get().fetchQuestions();
  },

  setFilterIsActive: (isActive) => {
    set((state) => ({ filters: { ...state.filters, isActive }, currentPage: 1 }));
    get().fetchQuestions();
  },

  resetFilters: () => {
    set({
      filters: {
        testId: '',
        categoryId: '',
        theoryId: '',
        tagId: '',
        gradeId: '',
        isActive: 'all',
      },
      currentPage: 1,
      categories: [],
      theories: [],
      tags: [],
    });
    get().fetchQuestions();
  },

  // Form cascading loaders
  loadFormCategories: async (testId) => {
    if (!testId || testId === 'undefined' || testId === 'null') {
      set({ formCategories: [], formTheories: [], formTags: [] });
      return;
    }
    set({ formCategories: [], formTheories: [], formTags: [], loadingFormCategories: true });
    try {
      const response = await api.get(`/Category/test/${testId}`);
      const rawList = extractList(response, 'categories');
      const list = rawList.map(normaliseCategory);
      set({ formCategories: list });
    } catch (err) {
      console.error('Failed to load form categories', err);
    } finally {
      set({ loadingFormCategories: false });
    }
  },

  loadFormTheories: async (categoryId) => {
    if (!categoryId || categoryId === 'undefined' || categoryId === 'null') {
      set({ formTheories: [], formTags: [] });
      return;
    }
    set({ formTheories: [], formTags: [], loadingFormTheories: true });
    try {
      const response = await api.get(`/PsychometricTheory/category/${categoryId}`);
      const rawList = extractList(response, 'theories');
      const list = rawList.map(normaliseTheory);
      set({ formTheories: list });
    } catch (err) {
      console.error('Failed to load form theories', err);
    } finally {
      set({ loadingFormTheories: false });
    }
  },

  loadFormTags: async (theoryId) => {
    if (!theoryId || theoryId === 'undefined' || theoryId === 'null') {
      set({ formTags: [] });
      return;
    }
    set({ formTags: [], loadingFormTags: true });
    try {
      const response = await api.get(`/PsychometricTag/theory/${theoryId}`);
      const rawList = extractList(response, 'tags');
      const list = rawList.map(normaliseTag);
      set({ formTags: list });
    } catch (err) {
      console.error('Failed to load form tags', err);
    } finally {
      set({ loadingFormTags: false });
    }
  },

  clearFormCascading: () => {
    set({ formCategories: [], formTheories: [], formTags: [] });
  },

  // Global Lookups
  fetchTests: async () => {
    if (get().tests.length > 0) return;
    set({ loadingTests: true });
    try {
      const response = await api.get('/Test', { params: { limit: 100 } });
      const data = (response.data?.data ?? response.data) as { tests?: Test[] } | Test[];
      const list = (Array.isArray(data) ? data : data?.tests) ?? [];
      set({ tests: list });
    } catch (err) {
      console.error('Failed to fetch tests lookup', err);
    } finally {
      set({ loadingTests: false });
    }
  },

  fetchGrades: async () => {
    if (get().grades.length > 0) return;
    set({ loadingGrades: true });
    try {
      const response = await api.get('/Grade', { params: { limit: 100 } });
      const data = response.data?.data ?? response.data;
      const rawList = (data?.grades ?? data?.data ?? (Array.isArray(data) ? data : [])) as Record<string, unknown>[];
      const list = rawList.map(normaliseGrade);
      set({ grades: list });
    } catch (err) {
      console.error('Failed to fetch grades lookup', err);
    } finally {
      set({ loadingGrades: false });
    }
  },

  // CRUD Actions
  fetchQuestions: async () => {
    if (fetchQuestionsController) fetchQuestionsController.abort();
    fetchQuestionsController = new AbortController();
    const ctrl = fetchQuestionsController;

    set({ loading: true, error: null });

    const { currentPage, limit, sortBy, sortDirection, debouncedSearchTerm, filters } = get();

    // Map filters to backend shape
    const params: Record<string, unknown> = {
      page: currentPage,
      limit,
      sortBy,
      sortDirection,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filters.testId) params.testId = filters.testId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.theoryId) params.theoryId = filters.theoryId;
    if (filters.tagId) params.tagId = filters.tagId;
    if (filters.gradeId) params.gradeId = filters.gradeId;
    if (filters.isActive !== 'all') params.isActive = filters.isActive === 'true';

    try {
      const response = await api.get('/Question', {
        params,
        signal: ctrl.signal,
      });

      if (ctrl !== fetchQuestionsController) return;

      const data = response.data?.data ?? response.data;
      const rawList = (data?.questions ?? data?.data ?? (Array.isArray(data) ? data : [])) as Record<string, unknown>[];
      const questionsList = rawList.map(normaliseQuestion);

      const pagination = (data?.pagination ?? {}) as { totalRecords?: number; totalPages?: number };
      const totalCount = pagination.totalRecords ?? data?.totalCount ?? questionsList.length;
      const totalPages = pagination.totalPages ?? (Math.ceil(totalCount / limit) || 1);

      set({ questions: questionsList, totalCount, totalPages });
    } catch (err: unknown) {
      const e = err as { name?: string; response?: { data?: { message?: string } } };
      if (e.name === 'CanceledError' || (err as { code?: string }).code === 'ERR_CANCELED') return;
      if (ctrl !== fetchQuestionsController) return;

      const msg = e.response?.data?.message ?? 'Failed to fetch questions.';
      set({ error: msg, questions: [], totalPages: 1, totalCount: 0 });
    } finally {
      if (ctrl === fetchQuestionsController) {
        set({ loading: false });
      }
    }
  },

  fetchQuestionById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/Question/${id}`);
      const raw = (response.data?.data ?? response.data) as Record<string, unknown>;
      const question = normaliseQuestion(raw);

      // Pre-load cascading values for edit form
      await get().loadFormCategories(String(question.testId));
      await get().loadFormTheories(String(question.categoryId));
      await get().loadFormTags(String(question.theoryId));

      set({ currentQuestion: question, loading: false });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Failed to fetch question.';
      set({ error: msg, loading: false });
      throw err;
    }
  },

  createQuestion: async (data) => {
    set({ saving: true, error: null });
    try {
      const payload = {
        questionText: data.questionText,
        testId: Number(data.testId),
        categoryId: Number(data.categoryId),
        theoryId: Number(data.theoryId),
        tagId: Number(data.tagId),
        gradeId: Number(data.gradeId),
        isActive: data.isActive,
        options: data.options.map((o) => ({
          optionText: o.optionText,
          score: Number(o.score),
          isCorrect: Boolean(o.isCorrect),
        })),
      };

      await api.post('/Question', payload);
      set({ saving: false });
      await get().fetchQuestions();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Failed to create question.';
      set({ error: msg, saving: false });
      throw err;
    }
  },

  updateQuestion: async (id, data) => {
    set({ saving: true, error: null });
    try {
      const payload: Record<string, unknown> = { id };
      if (data.questionText !== undefined) payload.questionText = data.questionText;
      if (data.testId !== undefined) payload.testId = Number(data.testId);
      if (data.categoryId !== undefined) payload.categoryId = Number(data.categoryId);
      if (data.theoryId !== undefined) payload.theoryId = Number(data.theoryId);
      if (data.tagId !== undefined) payload.tagId = Number(data.tagId);
      if (data.gradeId !== undefined) payload.gradeId = Number(data.gradeId);
      if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive);
      if (data.options !== undefined) {
        payload.options = data.options.map((o) => ({
          id: o.id ? Number(o.id) : undefined,
          optionText: o.optionText,
          score: Number(o.score),
          isCorrect: Boolean(o.isCorrect),
        }));
      }

      await api.put(`/Question/${id}`, payload);
      set({ saving: false });
      await get().fetchQuestions();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Failed to update question.';
      set({ error: msg, saving: false });
      throw err;
    }
  },

  deleteQuestion: async () => {
    const { deleteId, questions, currentPage } = get();
    if (!deleteId) return;

    set({ loading: true, error: null });
    try {
      await api.delete(`/Question/${deleteId}`);

      const remaining = questions.filter((q) => q.id !== deleteId);
      if (remaining.length === 0 && currentPage > 1) {
        set({ currentPage: currentPage - 1 });
      }

      set({ deleteOpen: false, deleteId: null });
      await get().fetchQuestions();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Failed to delete question.';
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
