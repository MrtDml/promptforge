import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getToken,
  clearAuthState,
  isTokenExpired,
  getRefreshToken,
  setToken,
} from "./auth";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ParseRequest,
  ParseResponse,
  GenerateRequest,
  GenerateResponse,
  Project,
  User,
  PaginatedResponse,
  DeployResult,
  DeployStatusResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── Axios instance ──────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s for generation requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor – attach JWT ───────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor – handle 401 + network retry ──────────────────────

const RETRY_STATUS_CODES = new Set([429, 502, 503, 504]);
const MAX_RETRIES = 3;

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // ── 401: attempt token refresh ──────────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const response = await axios.post<{ token: string }>(
            `${API_BASE_URL}/api/v1/auth/refresh`,
            { refreshToken }
          );
          const newToken = response.data.token;
          setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch {
          clearAuthState();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      } else {
        clearAuthState();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    // ── Network errors & transient server errors: exponential backoff retry ─
    const isNetworkError = !error.response;
    const isRetryableStatus =
      error.response && RETRY_STATUS_CODES.has(error.response.status);

    if (
      (isNetworkError || isRetryableStatus) &&
      !originalRequest._retry &&
      (originalRequest._retryCount ?? 0) < MAX_RETRIES
    ) {
      originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
      const delay = 1000 * Math.pow(2, originalRequest._retryCount - 1); // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

// ─── Auth endpoints ──────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    apiClient.post("/api/v1/auth/login", data),

  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    apiClient.post("/api/v1/auth/register", data),

  logout: (): Promise<AxiosResponse<void>> =>
    apiClient.post("/api/v1/auth/logout"),

  me: (): Promise<AxiosResponse<User>> =>
    apiClient.get("/api/v1/auth/me"),

  refresh: (refreshToken: string): Promise<AxiosResponse<{ token: string }>> =>
    apiClient.post("/api/v1/auth/refresh", { refreshToken }),

  forgotPassword: (email: string): Promise<AxiosResponse<{ message: string; resetUrl?: string }>> =>
    apiClient.post("/api/v1/auth/forgot-password", { email }),

  resetPassword: (token: string, newPassword: string): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post("/api/v1/auth/reset-password", { token, newPassword }),
};

// ─── Parser endpoints ────────────────────────────────────────────────────────

export const parserApi = {
  parse: (data: ParseRequest): Promise<AxiosResponse<ParseResponse>> =>
    apiClient.post("/api/v1/parser/parse", data),
};

// ─── Generator endpoints ─────────────────────────────────────────────────────

export const generatorApi = {
  generate: (data: GenerateRequest): Promise<AxiosResponse<GenerateResponse>> =>
    apiClient.post("/api/v1/generator/generate", data),

  getStatus: (projectId: string): Promise<AxiosResponse<{ status: string; progress?: number }>> =>
    apiClient.get(`/api/v1/generator/status/${projectId}`),

  /**
   * Fetches the generated project as a ZIP archive and triggers a browser
   * download. Uses the native fetch API so we can consume the raw blob
   * without axios unwrapping it.
   */
  downloadProject: async (projectId: string, filename?: string): Promise<void> => {
    const { getToken } = await import("./auth");
    const token = getToken();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/generator/download/${projectId}`,
      {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      throw new Error(`Download failed (${response.status}): ${text}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Derive filename: prefer Content-Disposition header, then caller arg, then fallback
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="?([^";\n]+)"?/i);
    const resolvedFilename =
      match?.[1] ?? filename ?? `project-${projectId}.zip`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = resolvedFilename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  },
};

// ─── Projects endpoints ──────────────────────────────────────────────────────

export const projectsApi = {
  list: (
    page = 1,
    limit = 20
  ): Promise<AxiosResponse<PaginatedResponse<Project>>> =>
    apiClient.get("/api/v1/projects", { params: { page, limit } }),

  get: (id: string): Promise<AxiosResponse<Project>> =>
    apiClient.get(`/api/v1/projects/${id}`),

  create: (data: Partial<Project>): Promise<AxiosResponse<Project>> =>
    apiClient.post("/api/v1/projects", data),

  update: (id: string, data: Partial<Project>): Promise<AxiosResponse<Project>> =>
    apiClient.patch(`/api/v1/projects/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<void>> =>
    apiClient.delete(`/api/v1/projects/${id}`),

  regenerate: (id: string): Promise<AxiosResponse<Project>> =>
    apiClient.post(`/api/v1/projects/${id}/regenerate`),
};

// ─── Users endpoints ─────────────────────────────────────────────────────────

export const usersApi = {
  getMe: (): Promise<AxiosResponse<User>> =>
    apiClient.get("/api/v1/users/me"),

  updateProfile: (data: Partial<User> & { name?: string }): Promise<AxiosResponse<User>> =>
    apiClient.patch("/api/v1/users/me", data),

  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse<void>> =>
    apiClient.patch("/api/v1/users/me/password", data),

  deleteAccount: (): Promise<AxiosResponse<void>> =>
    apiClient.delete("/api/v1/users/me"),
};

// ─── Deploy endpoints ─────────────────────────────────────────────────────────

export const deployApi = {
  /**
   * POST /api/v1/deploy/:projectId
   * Initiates a Railway deployment for the given project.
   */
  deploy: (
    projectId: string,
  ): Promise<AxiosResponse<{ success: boolean; message: string; data: DeployResult }>> =>
    apiClient.post(`/api/v1/deploy/${projectId}`),

  /**
   * GET /api/v1/deploy/:projectId/status
   * Returns the current deployment status (and live URL when available).
   */
  getStatus: (
    projectId: string,
  ): Promise<AxiosResponse<{ success: boolean; data: DeployStatusResponse }>> =>
    apiClient.get(`/api/v1/deploy/${projectId}/status`),
};

// ─── iyzico / Ödeme endpoints ─────────────────────────────────────────────────

export const stripeApi = {
  /** iyzico ödeme formunu oluşturur ve kullanıcıyı oraya yönlendirir. */
  createPortalSession: async (): Promise<void> => {
    const response = await apiClient.post<{ url: string }>("/api/v1/stripe/portal");
    const { url } = response.data;
    if (url && typeof window !== "undefined") {
      window.location.href = url;
    }
  },

  /** Aktif aboneliği iptal eder ve free plana düşürür. */
  cancelSubscription: (): Promise<AxiosResponse<{ message: string }>> =>
    apiClient.post("/api/v1/stripe/cancel"),
};

// ─── Admin endpoints ─────────────────────────────────────────────────────────

export const adminApi = {
  // Stats
  getStats: () => apiClient.get('/api/v1/admin/stats'),

  // Users
  getUsers: (page = 1, limit = 20, search?: string) =>
    apiClient.get('/api/v1/admin/users', { params: { page, limit, search } }),
  getUserById: (id: string) => apiClient.get(`/api/v1/admin/users/${id}`),
  updateUser: (id: string, data: Record<string, unknown>) =>
    apiClient.patch(`/api/v1/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/api/v1/admin/users/${id}`),

  // Projects
  getProjects: (page = 1, limit = 20, status?: string, search?: string) =>
    apiClient.get('/api/v1/admin/projects', { params: { page, limit, status, search } }),
  deleteProject: (id: string) => apiClient.delete(`/api/v1/admin/projects/${id}`),

  // Blog
  getBlogPosts: (page = 1, limit = 20) =>
    apiClient.get('/api/v1/admin/blog', { params: { page, limit } }),
  getBlogPostById: (id: string) => apiClient.get(`/api/v1/admin/blog/${id}`),
  createBlogPost: (data: Record<string, unknown>) => apiClient.post('/api/v1/admin/blog', data),
  updateBlogPost: (id: string, data: Record<string, unknown>) =>
    apiClient.patch(`/api/v1/admin/blog/${id}`, data),
  deleteBlogPost: (id: string) => apiClient.delete(`/api/v1/admin/blog/${id}`),

  // Settings
  getSettings: () => apiClient.get('/api/v1/admin/settings'),
  updateSettings: (settings: Array<{ key: string; value: string; label: string }>) =>
    apiClient.patch('/api/v1/admin/settings', { settings }),
};

// ─── Referral endpoints ───────────────────────────────────────────────────────

export const referralApi = {
  getMyReferral: () => apiClient.get('/api/v1/referral'),
  applyCode: (code: string) => apiClient.post('/api/v1/referral/apply', { code }),
};

export default apiClient;
