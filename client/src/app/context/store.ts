// store/schoolStore.ts
import { School } from '@/api/school';
import { create } from 'zustand';

export const useSchoolStore = create<{
  school: School | null;
  setSchool: (s: School) => void;
}>((set) => ({
  school: null,
  setSchool: (s) => set({ school: s }),
}));
