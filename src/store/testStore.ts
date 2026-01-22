// import { create } from 'zustand';
// import api from '@/api/axios';
import { describe } from 'node:test';

export interface QuestionOption {
    id: string;
    text: string;
}

// export interface Question {
//     id?: string;
//     text: string;
//     options: QuestionOption[]; // <-- updated to proper type
//     correctAnswer: string;
//     type?: 'multiple_choice' | 'text' | 'code';
//     marks?: number;
//     explanation?: string;
// }
export interface Question {
    questionId: number;
    questionText: string;
    category?: string;
    theory?: string;
    tag?: string;
    grade: string;
    options: Option[];
}

export interface Option {
    optionId: number | string;
    optionText: string;
}

export enum OptionID {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
}
export interface Test {
    icon?: any;
    color?: any;
    participants: any;
    rating: number;
    difficulty?: string;
    progress: number;
    tags: any;
    price: number;
    totalQuestionsPerPage: number;
    questionCount: number;
    instructions: any;
    id: string;
    testId?: string;
    title: string;
    description: string;
    category?: string;
    grade?: string;
    timeDuration: number;
    status?: 'active' | 'draft' | 'archived';
    isPublished?: boolean;
    completions?: number;
    completed?: number;
    createdDate?: string;
    updatedAt?: string;
    createdBy?: string;
    creationMethod?: 'manual' | 'ai';
    paymentStatus?: 'Un-Paid' | 'Paid';
}

export interface TestFilters {
    search: string;
    status: string;
    category: string;
    page: number;
    limit: number;
}

export interface TestResponse {
    code: string;
    message: string;
    data: {
        tests: Test[];
        totalCount: number;
    }
    page: number;
    limit: number;
    totalPages: number;
}

export interface AIConfig {
    generation_count: string;
    grade: string;
    stream: string | null;
    include_reverse_scored: boolean;
    similarity_threshold: number;
}

export interface CreateTestPayload {
    title: string;
    description: string;
    duration: number | null;
    questions: Question[];
    creationMethod: 'manual';
    category?: string;
    status?: 'draft' | 'active' | 'archived';
}

export interface CreateAITestPayload {
    questionType: string;
    grade: string;
    stream: string;
    generation_count: number;
}


// Test Taking Interfaces
export interface TestSession {
    id: string;
    testId: string;
    userId: string;
    status: 'in_progress' | 'completed' | 'abandoned';
    startedAt: string;
    duration: number;
    submittedAt?: string;
    currentPage: number;
    timeRemaining?: number;
}

export interface TestQuestionResponse {
    id: string;
    questionId: string;
    sessionId: string;
    answer: string;
    answeredAt: string;
    isCorrect?: boolean;
}

export interface PaginatedQuestionsResponse {
    questions: Question[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalQuestions: number;
        hasNext: boolean;
        hasPrevious: boolean;
        limit: number;
    };
    session: TestSession;
    test: Test;
}

export interface TestProgress {
    answers: number;
    answered: number;
    total: number;
    percentage: number;
    navigation: Array<{
        questionId: string;
        answered: boolean;
    }>;
}
// Add these interfaces to your existing types
export interface UserTestSubmission {
    testAttempts: any;
    attempts: any;
    testId: number;
    testTitle: string;
    testDescription: string;
    totalQuestions: number;
    attemptCount: number;
    lastAttemptDate: string;
}

export interface UserTestSubmissionData {
    items: UserTestSubmission[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface UserSubmissionsResponse {
    code: number;
    message: string;
    data: UserTestSubmissionData;
}

export interface UserSubmissionsFilters {
    search?: string;
    filterColumn?: string;
    filterValue?: string;
    page?: number;
    limit?: number;
}
import { create } from 'zustand';
import api from '@/api/axios';
import { usePaymentStore } from './paymentStore';
import { TestConfiguration } from '@/types/types';
// import type { Question, Test, TestFilters, CreateTestPayload, CreateAITestPayload, TestSession, TestProgress } from '@/types';

interface QuestionPagination {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    limit: number;
    totalQuestions: number;
}

interface TestState {
    // Test Management
    tests: Test[];
    currentTest: Test | null;
    loading: boolean;
    error: string | null;
    filters: TestFilters;
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    selectedTestId: string | null;
    deleteOpen: boolean;
    publishedTests: Test[];
    publicPublishedTests: Test[];
    // Test Taking State
    testQuestions: Question[];
    currentSession: TestSession | null;
    questionPagination: QuestionPagination;
    testProgress: TestProgress;
    userAnswers: Map<string, string>;
    testTakingLoading: boolean;
    testTakingError: string | null;
    userSubmissions: UserTestSubmissionData | null;
    userSubmissionsLoading: boolean;
    userSubmissionsError: string | null;
    searchTerm: string | null;
    deleteId: string | null;



    // Actions
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setFilters: (filters: Partial<TestFilters>) => void;
    fetchTests: () => Promise<void>;
    fetchTestById: (id: string) => Promise<void>;
    createTest: (testData: CreateTestPayload) => Promise<void>;
    createAITest: (testData: CreateAITestPayload) => Promise<void>;
    updateTest: (id: string, testData: Partial<Test>) => Promise<void>;
    deleteTest: () => Promise<void>;
    publishTest: (id: string, publish: boolean) => Promise<void>;
    unpublishTest: (id: string) => Promise<void>;
    duplicateTest: (id: string) => Promise<void>;
    clearCurrentTest: () => void;
    clearError: () => void;
    resetFilters: () => void;
    openDeleteDialog: (id: string) => void;
    closeDeleteDialog: () => void;





    // Test Taking
    getPublishedTests: () => Promise<void>;
    getPublicPublishedTests: () => Promise<void>;
    // startTest: (testId: string) => Promise<void>;
    fetchQuestions: (page?: number, limit?: number, sessionId?: string | null, testId?: string | number | null, gradeId?: string | number | null) => Promise<void>;
    submitAnswer: (testId: string, questionId: string, answer: string) => Promise<void>;
    submitTest: (testId: string, userId: string) => Promise<void>;
    fetchTestProgress: (testId: string, sessionId: string) => Promise<void>;
    goToNextQuestion: (testId: string) => Promise<void>;
    goToPreviousQuestion: (testId: string) => Promise<void>;
    // goToQuestion: (testId: string, pageNumber: number) => Promise<void>;
    setAnswerLocally: (questionId: string, answer: string) => void;
    getCurrentAnswer: (questionId: string) => string;
    hasAnswered: (questionId: string) => boolean;
    resetTestState: () => void;
    getCurrentQuestion: () => Question | null;
    updateQuestionPagination: (pagination: Partial<QuestionPagination>) => void;
    createConfigurableTest: (testData: any) => Promise<void>;
    fetchUserSubmissions: (filters?: UserSubmissionsFilters) => Promise<void>;
    clearUserSubmissions: () => void;
    //Configuraiton
    setSearchTerm: (term: string) => void;
    currentConfiguration: TestConfiguration | null;
    totalConfigurationPages: number | null;
    totalConfigurationsCount: number | null;
    fetchConfigurations: () => Promise<void>;
    fetchConfigurationById: (id: string) => Promise<void>;
    createConfiguration: (config: TestConfiguration) => Promise<void>;
    updateConfiguration: (id: string, config: Partial<TestConfiguration>) => Promise<void>;
    deleteConfiguration: () => Promise<void>;
    checkTestConfigurationByRole: (testId: string, roleId: string) => Promise<void>;
    configurations: TestConfiguration[];
    clearCurrentConfiguration: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const defaultFilters: TestFilters = {
    search: '',
    status: 'all',
    category: 'all',
    page: 1,
    limit: 5,
};

export const useTestStore = create<TestState>((set, get) => ({
    // Initial state
    tests: [],
    currentTest: null,
    loading: false,
    error: null,
    filters: defaultFilters,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5,
    selectedTestId: null,
    deleteOpen: false,
    publishedTests: [],
    publicPublishedTests: [],
    userSubmissions: null,
    userSubmissionsLoading: false,
    userSubmissionsError: null,
    // Test Taking State
    testQuestions: [],
    currentSession: null,
    questionPagination: {
        currentPage: 1,
        totalPages: 0,
        totalQuestions: 0,
        hasNext: false,
        hasPrevious: false,
        limit: 1
    },
    testProgress: {
        answered: 0,
        total: 0,
        percentage: 0,
        navigation: [],
        answers: 0
    },
    userAnswers: new Map(),
    testTakingLoading: false,
    testTakingError: null,
    currentConfiguration: null,
    searchTerm: "",
    configurations: [],
    deleteId: null,
    totalConfigurationPages: null,
    totalConfigurationsCount: null,

    // Test Management Actions 
    setPage: (page) => { set({ currentPage: page }); get().fetchTests(); },
    setLimit: (limit) => { set({ limit, currentPage: 1 }); get().fetchTests(); },
    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters, page: 1 }, currentPage: 1 });
        get().fetchTests();
    },
    fetchTests: async () => {
        set({ loading: true, error: null });
        try {
            const { currentPage, limit, filters } = get();
            const response = await api.get('/Test', {
                params: {
                    page: currentPage,
                    limit: 100,
                    search: filters.search || undefined,
                    status: filters.status !== 'all' ? filters.status : undefined,
                    category: filters.category !== 'all' ? filters.category : undefined
                }
            });
            const data = response.data;
            const totalCount = data.data.totalCount;
            set({
                tests: data.data.tests,
                totalPages: Math.ceil(totalCount / limit) || 1,
                totalCount,
                currentPage: currentPage > Math.ceil(totalCount / limit) ? 1 : currentPage,
                loading: false
            });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch tests', loading: false, tests: [], totalPages: 1, totalCount: 0 });
        }
    },




    fetchTestById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/Test/${id}`);
            set({ currentTest: response.data.data, loading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch test', loading: false });
            throw err;
        }
    },



    createConfigurableTest: async (payload) => {
        set({ loading: true, error: null });
        try {
            await api.post('/Test', { ...payload, category: payload.category || 'General', status: payload.status || "active", completions: 0 });
            // await get().fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to create test', loading: false });
            throw err;
        }
    },



    createTest: async (payload) => {
        set({ loading: true, error: null });
        try {
            await api.post('/Test', { ...payload, category: payload.category || 'General', status: payload.status || 'draft', completions: 0 });
            await get().fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to create test', loading: false });
            throw err;
        }
    },


    createAITest: async (payload) => {
        set({ loading: true, error: null });
        try {
            await api.post('/Question/generate', payload);
            await get().fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to create AI test', loading: false });
            throw err;
        }
    },


    updateTest: async (id, testData) => {
        set({ loading: true, error: null });
        testData.id = id;
        try {
            await api.put(`/Test/update`, testData);
            await get().fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update test', loading: false });
            throw err;
        }
    },


    deleteTest: async () => {
        const { selectedTestId, fetchTests, currentPage, tests } = get();
        if (!selectedTestId) return;
        set({ loading: true, error: null });
        try {
            await api.delete(`/Test/${selectedTestId}`);
            if (tests.filter(t => t.id !== selectedTestId).length === 0 && currentPage > 1) set({ currentPage: currentPage - 1 });
            set({ deleteOpen: false, selectedTestId: null });
            await fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete test', loading: false });
            throw err;
        }
    },


    publishTest: async (id, publish) => {
        set({ loading: true, error: null });
        try {
            await api.patch(`Test/${id}/publish-unpublish`, null, {
                params: {
                    publish: publish
                }
            });

            await get().fetchTests();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to publish test', loading: false });
            throw err;
        }
    },


    unpublishTest: async (id) => { set({ loading: true, error: null }); try { await api.patch(`/Test/${id}/unpublish`); await get().fetchTests(); } catch (err: any) { set({ error: err.response?.data?.message || 'Failed to unpublish test', loading: false }); throw err; } },
    duplicateTest: async (id) => { set({ loading: true, error: null }); try { await api.post(`/Test/duplicate/${id}`); await get().fetchTests(); } catch (err: any) { set({ error: err.response?.data?.message || 'Failed to duplicate test', loading: false }); throw err; } },
    clearCurrentTest: () => set({ currentTest: null }),
    clearError: () => set({ error: null }),
    resetFilters: () => { set({ filters: defaultFilters, currentPage: 1 }); get().fetchTests(); },
    openDeleteDialog: (id) => set({ selectedTestId: id, deleteOpen: true }),
    closeDeleteDialog: () => set({ selectedTestId: null, deleteOpen: false }),

    // --- Test Taking Actions ---
    getPublishedTests: async () => {
        set({ testTakingLoading: true, testTakingError: null });
        try {
            const response = await api.get('/Test/publishedTests');
            set({ publishedTests: response.data.data, testTakingLoading: false });
        } catch (err: any) {
            set({ testTakingError: err.response?.data?.message || 'Failed to fetch published tests', testTakingLoading: false });
            throw err;
        }
    },
    getPublicPublishedTests: async () => {
        set({ testTakingLoading: true, testTakingError: null });
        try {
            const response = await api.get('/Test/public/published-tests');
            set({ publicPublishedTests: response.data.data.publishedTets, testTakingLoading: false });
        } catch (err: any) {
            set({ testTakingError: err.response?.data?.message || 'Failed to fetch published tests', testTakingLoading: false });
            throw err;
        }
    },




    fetchQuestions: async (page = 1, limit = 1, sessionId: string | null = null, testIdParam: string | number | null = null, gradeIdParam: string | number | null = null) => {
        set({ testTakingLoading: true, testTakingError: null });
        try {
            const currentSessionId = sessionId || get().currentSession?.id;

            // Call the GetQuestions endpoint which returns the shape shown in the example
            const response = await api.get(`/QuestionBank/GetQuestions`, {
                params: {
                    // Prefer explicit params passed in; fall back to currentTest values
                    // testId: testIdParam ?? get().currentTest?.testId ?? undefined,
                    // gradeId: gradeIdParam ?? get().currentTest?.grade ?? undefined,
                    testId: 1,
                    gradeId: 1,
                    page,
                    pageSize: limit,
                    sessionId: currentSessionId || undefined
                }
            });

            const data = response.data || {};

            // Support a few possible shapes but prefer the documented shape which contains `questions` and `pagination`
            const rawQuestions = Array.isArray(data.questions)
                ? data.questions
                : Array.isArray(data.data?.questions)
                    ? data.data.questions
                    : Array.isArray(data.data?.items)
                        ? data.data.items
                        : [];

            // Map upstream question shape to local `Question` shape
            const questions: Question[] = rawQuestions.map((q: any) => ({
                questionId: q.question_Id ?? q.questionId ?? q.id,
                questionText: q.question_Text ?? q.questionText ?? q.text ?? '',
                category: q.category ?? '',
                theory: q.theory ?? '',
                tag: q.tag ?? '',
                grade: data.grade ?? q.grade ?? '',
                options: Array.isArray(q.options)
                    ? q.options.map((o: any) => ({
                        optionId: o.option_Id ?? o.optionId ?? o.id,
                        optionText: o.option_Text ?? o.optionText ?? o.text ?? ''
                    }))
                    : []
            }));

            // Build pagination from response (fall back to simple values if missing)
            const pagination = data.pagination ?? data.data?.pagination ?? {
                currentPage: page,
                pageSize: limit,
                totalItems: questions.length,
                totalPages: Math.max(1, Math.ceil(questions.length / (limit || 1)))
            };

            const questionPagination = {
                currentPage: pagination.currentPage ?? page,
                totalPages: pagination.totalPages ?? Math.max(1, Math.ceil((data.totalQuestions ?? pagination.totalItems ?? questions.length) / ((pagination.pageSize ?? limit) || 1))),
                totalQuestions: data.totalQuestions ?? pagination.totalItems ?? questions.length,
                hasNext: (pagination.currentPage ?? page) < (pagination.totalPages ?? 1),
                hasPrevious: (pagination.currentPage ?? page) > 1,
                limit: pagination.pageSize ?? limit ?? 1
            };

            set({
                testQuestions: questions,
                questionPagination,
                currentSession: data.session ?? get().currentSession,
                testTakingLoading: false
            });

        } catch (err: any) {
            set({
                testTakingError: err.response?.data?.message || 'Failed to fetch questions',
                testTakingLoading: false
            });
            throw err;
        }
    },





    submitAnswer: async (testId, questionId, answer) => {
        const { currentSession, userAnswers } = get();
        if (!currentSession) throw new Error('No active test session');
        try {
            const updatedAnswers = new Map(userAnswers);
            updatedAnswers.set(questionId, answer);
            set({ userAnswers: updatedAnswers });
            await api.post(`/Test/${testId}/questions/${questionId}/answer`, { answer, sessionId: currentSession.id });
            await get().fetchTestProgress(testId, currentSession.id);
        } catch (err: any) {
            const revertedAnswers = new Map(userAnswers);
            revertedAnswers.delete(questionId);
            set({ userAnswers: revertedAnswers });
            throw err;
        }
    },
    fetchTestProgress: async (testId, sessionId) => {
        try {
            const response = await api.get(`/Test/${testId}/progress`, { params: { sessionId } });
            set({ testProgress: response.data.data });
        } catch (err) { console.error('Failed to fetch progress', err); }
    },

    // submitTest: async (testId, userId) => {
    //     const { currentSession } = get();
    //     if (!currentSession) throw new Error('No active test session');
    //     try {
    //         await api.post(`/Test/${testId}/submit`,
    //             {
    //                 sessionId: currentSession.id,
    //                 userId: userId
    //             }
    //         );
    //         get().resetTestState();
    //     } catch (err) {
    //         throw err;
    //     }
    // },
    submitTest: async (testId, userId) => {
        const { userAnswers } = get();
        try {

            // Convert Map into required array format
            const answersArray = Array.from(userAnswers.entries()).map(([questionId, optionId]) => ({
                questionId,
                optionId
            }));

            const payload = {
                testId,
                userId,
                answers: answersArray
            };
            await api.post(`/tests/submit`, payload);
            usePaymentStore.getState().clearPaidTest(userId, testId);
            get().resetTestState();
        } catch (err) {
            throw err;
        }
    },

    goToNextQuestion: async () => {
        const { questionPagination, currentTest, currentSession } = get();

        if (questionPagination.hasNext) {
            await get().fetchQuestions(
                questionPagination.currentPage + 1,
                questionPagination.limit ?? currentTest?.totalQuestionsPerPage ?? 1,
                currentSession?.id ?? null,
                currentTest?.testId ?? undefined,
                currentTest?.grade ?? undefined
            );
        }
    },

    goToPreviousQuestion: async () => {
        const { questionPagination, currentTest, currentSession } = get();
        if (questionPagination.hasPrevious) {
            await get().fetchQuestions(
                Math.max(1, questionPagination.currentPage - 1),
                questionPagination.limit ?? currentTest?.totalQuestionsPerPage ?? 1,
                currentSession?.id ?? null,
                currentTest?.testId ?? undefined,
                currentTest?.grade ?? undefined
            );
        }
    },
    // goToQuestion: async (testId, pageNumber) => {
    //     const { questionPagination, currentSession } = get();
    //     if (pageNumber >= 1 && pageNumber <= questionPagination.totalPages) await get().fetchQuestions( pageNumber, currentSession?.id);
    // },
    setAnswerLocally: (questionId, answer) => {
        const userAnswers = new Map(get().userAnswers);
        userAnswers.set(questionId, answer);
        // const total = get().currentTest?.questions?.length || 0;
        set({
            userAnswers,
            // testProgress: {
            //     ...get().testProgress,
            //     answered: userAnswers.size,
            //     total,
            //     percentage: total ? (userAnswers.size / total) * 100 : 0
            // }
        });
    },
    getCurrentAnswer: (questionId) => get().userAnswers.get(questionId) || '',
    hasAnswered: (questionId) => get().userAnswers.has(questionId),
    resetTestState: () => set({
        testQuestions: [],
        currentSession: null,
        questionPagination: { currentPage: 1, totalPages: 0, totalQuestions: 0, hasNext: false, hasPrevious: false, limit: 1 },
        userAnswers: new Map(),
        testProgress: {
            answered: 0, total: 0, percentage: 0, navigation: [],
            answers: 0
        },
        testTakingError: null,
        testTakingLoading: false
    }),
    getCurrentQuestion: () => {
        const { testQuestions, questionPagination } = get();
        return testQuestions[questionPagination.currentPage - 1] || null;
    },
    updateQuestionPagination: (pagination) => {
        const { questionPagination } = get();
        const sanitizedCurrentPage = Math.min(Math.max(pagination.currentPage || questionPagination.currentPage, 1), pagination.totalPages || questionPagination.totalPages);
        set({
            questionPagination: {
                ...questionPagination,
                ...pagination,
                currentPage: sanitizedCurrentPage,
                hasNext: sanitizedCurrentPage < (pagination.totalPages || questionPagination.totalPages),
                hasPrevious: sanitizedCurrentPage > 1
            }
        });
    },
    fetchUserSubmissions: async (filters: UserSubmissionsFilters = {}) => {
        set({ userSubmissionsLoading: true, userSubmissionsError: null });
        try {
            const {
                search = '',
                filterColumn = '',
                filterValue = '',
                page = 1,
                limit = 10
            } = filters;

            const response = await api.get('/Test/user-submissions', {
                params: {
                    search,
                    filterColumn,
                    filterValue,
                    page,
                    limit
                }
            });

            const data: UserSubmissionsResponse = response.data;

            if (data.code === 200) {
                set({
                    userSubmissions: data.data,
                    userSubmissionsLoading: false
                });
            } else {
                set({
                    userSubmissionsError: data.message || 'Failed to fetch user submissions',
                    userSubmissionsLoading: false
                });
            }
        } catch (err: any) {
            set({
                userSubmissionsError: err.response?.data?.message || 'Failed to fetch user submissions',
                userSubmissionsLoading: false
            });
            throw err;
        }
    },

    clearUserSubmissions: () => {
        set({
            userSubmissions: null,
            userSubmissionsError: null
        });
    },
    //configuration 
    fetchConfigurations: async () => {
        set({ loading: true, error: null });
        try {
            const { currentPage, limit, searchTerm } = get();
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                search: searchTerm,
            });

            const response = await api.get(`TestConfiguration/all?${queryParams}`);

            set({
                configurations: response?.data?.testconfigurations,
                totalConfigurationPages: response?.data?.pagination?.totalPages,
                totalConfigurationsCount: response?.data?.pagination?.totalRecords,
                loading: false
            });
        } catch (error) {
            set({ error: 'Failed to fetch configurations', loading: false });
        }
    },
    fetchConfigurationById: async (id: string) => {
        set({ loading: true, error: null });
        try {
            // Replace with your actual API call
            const response = await api.get(`TestConfiguration/${id}`);
            // const configuration = await response.json();
            set({ currentConfiguration: response.data.data, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch configuration', loading: false });
        }
    },

    createConfiguration: async (config: TestConfiguration) => {
        set({ loading: true, error: null });
        try {
            // Replace with your actual API call
            const response = await api.post('TestConfiguration/create',
                config
            );
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
            // Replace with your actual API call
            const response = await api.put(`TestConfiguration/update/${id}`, {
                config
            });

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
    checkTestConfigurationByRole: async () => {

    },
    clearCurrentConfiguration: () =>
        // set({ currentConfiguration: null }),
        set({}),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    setSearchTerm: (term: string) => set({ searchTerm: term, currentPage: 1 }),
}));
