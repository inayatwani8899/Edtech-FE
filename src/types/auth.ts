export type UserRole = 'Student' | 'Professional' | 'Counselor' | 'Admin';

export interface User {
  roleId: string;
  phoneNumber: string;
  phone: string;
  id: string;
  firstName: string;
  lastName: string;
  name?:string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  dateOfBirth?: Date;
  status: 'active' | 'inactive';
  lastActive: Date;
  testsCompleted: number;
  profile?: StudentProfile | ProfessionalProfile | CounselorProfile;
}
export interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_Token: string;
    token_Type: string;
    user: User;
  };
}
// Then your mock data would work with minor adjustments:


export interface StudentProfile {
  grade?: number;
  school?: string;
  dateOfBirth?: Date;
  interests?: string[];
}

export interface ProfessionalProfile {
  company?: string;
  position?: string;
  industry?: string;
  experience?: number;
}

export interface CounselorProfile {
  institution?: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}