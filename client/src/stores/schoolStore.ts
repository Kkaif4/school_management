import { create } from 'zustand';
import { School } from '@/types/school';

interface SchoolState {
  school: School | null;
  setSchool: (school: School | null) => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  school: null,
  setSchool: (school) => set({ school }),
}));
