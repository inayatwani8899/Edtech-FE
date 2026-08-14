export interface PsychometricTheory {
  id: string;
  theoryName: string;
  name?: string;
  description: string;
  categoryId?: string | number | null;
  categoryName?: string;
  category?: string | { id?: string | number; name?: string; categoryName?: string };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PsychometricTheoryFormData {
  theoryName: string;
  description: string;
  categoryId?: string;
  isActive?: boolean;
}
