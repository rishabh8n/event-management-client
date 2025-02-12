import { create } from "zustand";
import axios from "@/lib/axios";

interface User {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateAvatar: (avatar: string) => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>;
  clearError: () => void;
  clearLoading: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  register: async (email, password, fullName) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/users/register", {
        email,
        password,
        fullName,
      });
      set({ user: response.data.data, isAuthenticated: true, error: null });
    } catch (error: any) {
      set({ error: error?.response?.data.message || "Error signing in" });
    }
    set({ isLoading: false });
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/users/login", { email, password });
      set({ user: response.data.data, isAuthenticated: true, error: null });
    } catch (error: any) {
      console.log(error);
      set({ error: error?.response?.data.message });
    }
    set({ isLoading: false });
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.get("/users/logout");
      set({ user: null, isAuthenticated: false, error: null });
    } catch (error: any) {
      set({ error: error?.response?.data.message });
    }
    set({ isLoading: false });
  },
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/users/me");
      set({ user: response.data.data, isAuthenticated: true, error: null });
    } catch (error) {}
    set({ isLoading: false });
  },
  updateAvatar: async (avatar) => {
    set({ isLoading: true });
    try {
      const response = await axios.put("/users/updateavatar", { avatar });
      set({ user: response.data.data, error: null });
    } catch (error: any) {
      set({ error: error?.response?.data.message });
    }
    set({ isLoading: false });
  },
  updateProfile: async (fullName) => {
    set({ isLoading: true });
    try {
      const response = await axios.put("/users/updatedetails", { fullName });
      set({ user: response.data.data, error: null });
    } catch (error: any) {
      set({ error: error?.response?.data.message });
    }
    set({ isLoading: false });
  },
  clearError: () => set({ error: null }),
  clearLoading: () => set({ isLoading: false }),
}));

export default useUserStore;
