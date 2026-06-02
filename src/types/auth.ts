export type UserRole = 'Student' | 'Professional' | 'Counselor' | 'Admin' | 'School' | 'SuperAdmin';

export interface User {
  id: number; // Changed from string to number
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // Changed from Date to string
  grade?: string; // Added
  phone: string; // Added
  role: UserRole;
  roleId: number; // Changed from string to number

  // Optional fields not in login response but maybe used elsewhere
  phoneNumber?: string;
  name?: string;
  avatar?: string;
  createdAt?: Date; // Made optional
  lastLogin?: Date;
  status?: 'active' | 'inactive'; // Made optional
  lastActive?: Date; // Made optional
  testsCompleted?: number; // Made optional
  profile?: StudentProfile | ProfessionalProfile | CounselorProfile;
}

export interface Permission {
  menuId: number;
  title: string;
  url: string;
  icon: string;
  color: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    access_Token: string;
    token_Type: string;
    user: User;
    permissions?: Permission[];
    tenant?: string | null;
    loginUrl?: string | null;
    isSuccess?: boolean;
    errorMessage?: string | null;
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