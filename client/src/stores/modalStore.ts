import { create } from 'zustand';

type AuthModalType = 'login' | 'signup' | null;

interface ModalStore {
  authModal: AuthModalType;
  openAuthModal: (type: AuthModalType) => void;
  closeAuthModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  authModal: null,
  openAuthModal: (type) => set({ authModal: type }),
  closeAuthModal: () => set({ authModal: null }),
}));
