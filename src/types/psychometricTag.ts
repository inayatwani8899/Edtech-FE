export interface PsychometricTag {
  id: string;
  tagName: string;
  name?: string;
  description: string;
  theoryId?: string | number | null;
  theoryName?: string;
  theory?: string | { id?: string | number; name?: string; theoryName?: string };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PsychometricTagFormData {
  tagName: string;
  description: string;
  theoryId?: string;
  isActive?: boolean;
}
