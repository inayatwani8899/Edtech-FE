import { User, UserRole } from "@/types/auth";
import { Test, TestType } from "@/types/test";

// services/api.ts
interface ApiResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiParams {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
}

// Mock API functions (replace with actual API calls)
export const usersApi = {
    getUsers: async ({ page, limit, search, filter }: ApiParams): Promise<ApiResponse<User>> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // This would be your actual API call
        // const response = await fetch(`/api/users?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
        // return response.json();

        // Mock data
        const allUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
            id: (i + 1).toString(),
            firstName: `User`,
            lastName: `${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: (i % 3 === 0 ? 'student' : i % 3 === 1 ? 'professional' : 'counselor') as UserRole,
            status: i % 5 === 0 ? 'inactive' : 'active',
            lastActive: new Date(`2024-01-${String(30 - i).padStart(2, '0')}`),
            testsCompleted: Math.floor(Math.random() * 30),
            createdAt: new Date(`2024-01-${String(30 - i).padStart(2, '0')}`),
        }));

        let filteredUsers = allUsers;

        // Apply search filter
        if (search) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply role filter
        if (filter && filter !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.role === filter);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
            data: paginatedUsers,
            total: filteredUsers.length,
            page,
            limit,
            totalPages: Math.ceil(filteredUsers.length / limit),
        };
    },
};

export const testsApi = {
    getTests: async ({ page, limit, search, filter }: ApiParams): Promise<ApiResponse<Test>> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const allTests: Test[] = Array.from({ length: 25 }, (_, i) => ({
            id: (i + 1).toString(),
            title: `Test ${i + 1}`,
            description: `Comprehensive ${i % 3 === 0 ? 'Aptitude' : i % 3 === 1 ? 'Personality' : 'Professional'} Assessment`,
            type: (i % 3 === 0 ? 'aptitude' : i % 3 === 1 ? 'personality' : 'professional') as TestType,
            questions: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, qIndex) => ({
                id: qIndex.toString(),
                text: `Question ${qIndex + 1}`,
                type: 'multiple-choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 0
            })), // Mock questions array
            timeLimit: Math.floor(Math.random() * 120) + 30,
            targetAudience: ['all'],
            difficultyLevel: i % 3 === 0 ? 'beginner' : i % 3 === 1 ? 'intermediate' : 'advanced',
            estimatedDuration: Math.floor(Math.random() * 120) + 30,
            instructions: 'Complete all questions within the time limit.',
            isActive: i % 4 !== 0,
            createdBy: 'system',
            createdAt: new Date(`2024-01-${String(25 - i).padStart(2, '0')}`),
        }));

        let filteredTests = allTests;

        if (search) {
            filteredTests = filteredTests.filter(test =>
                test.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter && filter !== 'all') {
            filteredTests = filteredTests.filter(test => test.status === filter);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTests = filteredTests.slice(startIndex, endIndex);

        return {
            data: paginatedTests,
            total: filteredTests.length,
            page,
            limit,
            totalPages: Math.ceil(filteredTests.length / limit),
        };
    },
};