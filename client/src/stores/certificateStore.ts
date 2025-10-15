import { create } from 'zustand';
import { certificateAPI } from '@/lib/api';
import { toast } from 'sonner';

export interface Certificate {
  _id: string;
  name: string;
  templateCode: string;
  schoolId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CertificateState {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCertificates: (schoolId: string) => Promise<void>;
  addCertificate: (certificate: Certificate) => void;
  removeCertificate: (id: string) => void;
  clearCertificates: () => void;
}

export const useCertificateStore = create<CertificateState>((set, get) => ({
  certificates: [],
  loading: false,
  error: null,

  // Fetch all certificates for a given school
  fetchCertificates: async (schoolId: string) => {
    if (!schoolId) {
      set({ error: 'Invalid school ID provided.' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await certificateAPI.getCertificates(schoolId);
      const data = response?.data?.data || [];

      set({ certificates: data });
      toast.success('Certificates loaded successfully');
    } catch (err: any) {
      console.error('Failed to fetch certificates:', err);
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          'Failed to fetch certificates',
      });
      toast.error('Failed to load certificates');
    } finally {
      set({ loading: false });
    }
  },

  addCertificate: (certificate) => {
    const { certificates } = get();
    set({ certificates: [certificate, ...certificates] });
  },

  removeCertificate: (id) => {
    const { certificates } = get();
    set({ certificates: certificates.filter((c) => c._id !== id) });
  },

  clearCertificates: () => set({ certificates: [], error: null }),
}));
