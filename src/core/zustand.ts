import { create } from 'zustand'

type DataState<T = any> = {
    data: T;
    setData: (data: T) => void;
    type: "create" | "update";
    setType: (type: "create" | "update") => void;

};

export const useDataStore = create<DataState>((set) => ({
    data: {},
    setData: (data) => set({ data }),
    type: "create",
    setType: (type: "create" | "update") => set({ type }),
}));
