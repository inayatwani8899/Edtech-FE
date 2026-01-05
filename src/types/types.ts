// ---------- Roles & Status ----------
export type UserRole = "Student" | "Counselor" | "Admin" | "Professional" | "School" | "";

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}
// ---------- Role ----------
export interface Role {
  id: number;
  name: string;
  isDeleted: boolean;
  createdDate: Date;
  lastModifiedDate: Date | null;
}

// ---------- Base User ----------
export interface User {
  phone: string;
  qualification?: string;
  experience?: string;
  specialization?: string;
  organization?: string;
  bio?: string;
  id?: string;
  firstName: string;
  lastName: string;
  name?: string; // optional full name
  email: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;

  roleId: number;        // 🔑 from API
  role: UserRole;        // mapped from Role.name

  isAdmin?: boolean;
  status: UserStatus;
  isActive?: boolean;

  createdDate?: Date;
  createdBy?: number;
  modifiedBy?: number;
  lastModifiedDate?: Date | null;
  lastLogin?: Date;
  isDeleted?: boolean;

  gradeLevel?: string | null;
  dateOfBirth?: Date;

  // Common professional fields
  highestQualification?: string;
  yearsOfExperience?: number;
  areaOfSpecialization?: string;
  currentOrganization?: string;
  licenseNumber?: string;
  professionalBio?: string;
}

// ---------- Extended User Types ----------
export interface Student extends User {
  role: "Student";
  grade?: string;
  schoolName?: string;
  counselorId?: string;
  dateOfBirth: Date; // required for Student
}

export interface Counselor extends User {
  role: "Counselor";
  institution?: string;
  specialization?: string;
  schoolId?: string;
}

export interface School extends User {
  role: "School";
  orgType?: string;
  userCount?: number;
  position?: string;
  department?: string;
}

export interface Admin extends User {
  role: "Admin";
}

// ---------- Test-related Models ----------
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration?: number; // in minutes
  questions: Question[];
  creatorId: string; // counselor or admin ID
}

export enum TestAssignmentStatus {
  Pending = "Pending",
  InProgress = "In Progress",
  Completed = "Completed",
}

export interface TestAssignment {
  id: string;
  studentId: string;
  testId: string;
  status: TestAssignmentStatus;
  assignedDate: string;
  startTime?: number;
  endTime?: number;
  answers: Record<string, string>;
  score?: number;
  markedForReview: string[];
}

// ---------- API Response Types ----------
export interface GenericResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// ---------- Student Profile Type ----------
export interface StudentProfile {
  id: number;
  userId: number;
  gradeLevel: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface StudentProfileResponse extends GenericResponse<StudentProfile> { }

export interface ResponseData {
  users: User[];
  totalCount: number;
}

// ---------- User Stats Type ----------
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
}

export interface UserStatsResponse extends GenericResponse<UserStats> { }


export interface RolePrice {
  roleId: string;
  price: number;
}

export interface TestConfiguration {
  id?: string;
  isActive?: boolean;
  rolePrices: RolePrice[];
  testId: string;
  questionsPerPage: number;
  submitType: 'OneGo' | 'PerPage';
  allowMultiplePurchases: boolean;
  canResume: boolean;
  testInstructions: string;
}
//Categories 
// types/types.ts
export interface Category {
  id: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// If you need to extend for API responses:
export interface CategoryResponse {
  categories: Category[];
  pagination: {
    totalPages: number;
    totalRecords: number;
    currentPage: number;
    limit: number;
  };
}