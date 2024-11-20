import { create } from 'zustand';

const usePatientsStore = create((set) => ({
  patients: [],
  loading: false,
  updatePatientsArray: (patients) => set({ patients }),
  setLoading: (loading) => set({ loading }),
}));

export default usePatientsStore;
