import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import type { LoginCredentials, RegisterAdminData, RegisterSuperAdminData, RegisterOrganizationAdminData, UserResponse, TokenResponse } from '../../services/api';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  role: string | null;
  organizationId: number | null;
  permissions: string[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') || null : null,
  role: null,
  organizationId: null,
  permissions: [],
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.login(credentials);
      const { data } = response;
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.access_token);
      }
      
      return {
        token: data.data.access_token,
        role: data.data.role,
        organizationId: data.data.organization_id || null,
        permissions: data.data.permissions,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (credentials: RegisterAdminData, { rejectWithValue }) => {
    try {
      const response = await api.registerAdmin(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

export const registerSuperAdmin = createAsyncThunk(
  'auth/registerSuperAdmin',
  async (credentials: RegisterSuperAdminData, { rejectWithValue }) => {
    try {
      const response = await api.registerSuperAdmin(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

export const registerOrganizationAdmin = createAsyncThunk(
  'auth/registerOrganizationAdmin',
  async (credentials: RegisterOrganizationAdminData, { rejectWithValue }) => {
    try {
      const response = await api.registerOrganizationAdmin(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; role: string; organizationId: number | null; permissions: string[] }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.organizationId = action.payload.organizationId;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Super Admin
      .addCase(registerSuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSuperAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerSuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Organization Admin
      .addCase(registerOrganizationAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOrganizationAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerOrganizationAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<{ data: UserResponse }>) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.organizationId = null;
        state.permissions = [];
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
