import axiosInstance from "@/services/axios.config";


export const publicApi = {

  healthCheck: async () => {
    return axiosInstance.get("/health", { requiresAuth: false });
  },


  login: async (email: string, password: string) => {
    return axiosInstance.post(
      "/api/v1/auth/login",
      { email, password },
      { requiresAuth: false }
    );
  },

  // Register
  register: async (name: string, email: string, password: string) => {
    return axiosInstance.post(
      "/api/v1/auth/signup",
      { name, email, password },
      { requiresAuth: false }
    );
  },


  refreshToken: async () => {
    return axiosInstance.post(
      "/api/v1/auth/refresh",
      {},
      { requiresAuth: false }
    );
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    return axiosInstance.post(
      "/api/v1/auth/forgot-password",
      { email },
      { requiresAuth: false }
    );
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    return axiosInstance.post(
      "/api/v1/auth/reset-password",
      { token, newPassword },
      { requiresAuth: false }
    );
  },
};

// ============================================
// PROTECTED APIS (Authentication required)
// ============================================

export const protectedApi = {
  // User Profile
  getCurrentUser: async () => {
    return axiosInstance.get("/api/v1/user/me", { requiresAuth: true });
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    return axiosInstance.put("/api/v1/user/profile", data, {
      requiresAuth: true,
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return axiosInstance.post(
      "/api/v1/user/change-password",
      { oldPassword, newPassword },
      { requiresAuth: true }
    );
  },

  // Spaces - Get all user's spaces
  getSpaces: async () => {
    return axiosInstance.get("/api/v1/spaces", { requiresAuth: true });
  },

  // Spaces - Get specific space by ID
  getSpace: async (spaceId: number) => {
    return axiosInstance.get(`/api/v1/spaces/${spaceId}`, {
      requiresAuth: true,
    });
  },

  // Spaces - Create new space
  createSpace: async (name: string, description: string = '') => {
    return axiosInstance.post(
      "/api/v1/spaces",
      { name, description },
      { requiresAuth: true }
    );
  },

  // Spaces - Update existing space
  updateSpace: async (
    spaceId: number,
    data: { name?: string; description?: string }
  ) => {
    return axiosInstance.put(
      `/api/v1/spaces/${spaceId}`,
      data,
      { requiresAuth: true }
    );
  },

  // Spaces - Delete space
  deleteSpace: async (spaceId: number) => {
    return axiosInstance.delete(`/api/v1/spaces/${spaceId}`, {
      requiresAuth: true,
    });
  },

  // Content - Get all contents in a space with optional type filter
  getContents: async (spaceId: number, type?: string) => {
    const params = type ? { content_type: type } : {};
    return axiosInstance.get(`/api/v1/spaces/${spaceId}/contents`, {
      params,
      requiresAuth: true,
    });
  },

  // Content - Get specific content by ID
  getContent: async (spaceId: number, contentId: number) => {
    return axiosInstance.get(
      `/api/v1/spaces/${spaceId}/contents/${contentId}`,
      { requiresAuth: true }
    );
  },

  // Content - Create new content in a space
  createContent: async (
    spaceId: number,
    data: {
      title: string;
      type: string;
      content: string;
      url?: string;
    }
  ) => {
    return axiosInstance.post(
      `/api/v1/spaces/${spaceId}/contents`,
      data,
      { requiresAuth: true }
    );
  },

  // Content - Update existing content
  updateContent: async (
    spaceId: number,
    contentId: number,
    data: Partial<{
      title: string;
      content: string;
      url: string;
    }>
  ) => {
    return axiosInstance.put(
      `/api/v1/spaces/${spaceId}/contents/${contentId}`,
      data,
      { requiresAuth: true }
    );
  },

  // Content - Delete content
  deleteContent: async (spaceId: number, contentId: number) => {
    return axiosInstance.delete(
      `/api/v1/spaces/${spaceId}/contents/${contentId}`,
      { requiresAuth: true }
    );
  },

  // Search
  search: async (
    query: string,
    filters?: { tag?: string; type?: string }
  ) => {
    return axiosInstance.get("/api/v1/search", {
      params: { q: query, ...filters },
      requiresAuth: true,
    });
  },

  // Tags
  getTags: async () => {
    return axiosInstance.get("/api/v1/tags", {
      requiresAuth: true,
    });
  },

  // Activity
  getRecentActivity: async () => {
    return axiosInstance.get("/api/v1/activity/recent", {
      requiresAuth: true,
    });
  },

  
  logout: async () => {
    return axiosInstance.post(
      "/api/v1/auth/logout",
      {},
      { requiresAuth: true }
    );
  },


  share_space:  ({ email, space_id ,permission}: { email: string; space_id: number,permission:string }) => {
  return axiosInstance.post(
    `/api/v1/share/${space_id}`,
    { email , permission },
    {
      requiresAuth: true,
    }
  );
  }
};