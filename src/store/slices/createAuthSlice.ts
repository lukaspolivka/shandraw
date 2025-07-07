import config from '@/config';
import { AppStore } from '../useAppStore';
import { StoreSlice } from '../types';

interface LoginValues {
  username: string;
  password: string;
}

interface RegisterValues {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface ForgotPasswordValues {
  email: string;
}

interface ResetPasswordValues {
  password: string;
  token: string;
}

interface ChangePasswordValues {
  newPassword: string;
  currentPassword: string;
}

interface UpdateProfileValues {
  name?: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  token: string | null;
  user: UserProfile | null;
  getToken: () => string | null;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  login: (values: LoginValues) => Promise<{ success: boolean; message: string }>;
  register: (values: RegisterValues) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (values: ForgotPasswordValues) => Promise<{ success: boolean; message: string }>;
  resetPassword: (values: ResetPasswordValues) => Promise<{ success: boolean; message: string }>;
  changePassword: (values: ChangePasswordValues) => Promise<{ success: boolean; message: string }>;
  updateProfile: (values: UpdateProfileValues) => Promise<{ success: boolean; message: string }>;
  fetchUser: () => Promise<void>;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  isAuthenticated: false,
  isAuthLoading: true,
  token: null,
  user: null,

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(config.token_name) || null;
    }
    return null;
  },

  setUser: (user: UserProfile | null) =>
    set({
      user,
      isAuthenticated: !!user,
      isAuthLoading: false,
    }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(config.token_name);
    }
    set({
      isAuthenticated: false,
      isAuthLoading: false,
      token: null,
      user: null,
    });
  },

  login: async (values: LoginValues) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(config.token_name, data.data.token);
        await get().fetchUser();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  register: async (values: RegisterValues) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  forgotPassword: async (values: ForgotPasswordValues) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  resetPassword: async (values: ResetPasswordValues) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  changePassword: async (values: ChangePasswordValues) => {
    try {
      const token = get().getToken();
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  updateProfile: async (values: UpdateProfileValues) => {
    try {
      const token = get().getToken();
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        get().setUser(data.data);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch {
      return { success: false, message: 'Could not connect to the server.' };
    }
  },

  fetchUser: async () => {
    const token = get().getToken();
    if (!token) {
      return get().logout();
    }

    try {
      const res = await fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        set({
          token,
          user: data.data,
          isAuthenticated: true,
          isAuthLoading: false,
        });
      } else {
        get().logout();
      }
    } catch {
      get().logout();
    }
  },
});
