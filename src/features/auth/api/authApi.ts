import axiosInstance from "@/lib/axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

// 🔐 Admin Login API
export const adminLoginApi = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post("/accounts/admin/login", credentials);
  return response.data;
};

// 🔄 Token Refresh API
export const adminRefreshTokenApi = async () => {
  const response = await axiosInstance.post("/accounts/token/refresh");
  return response.data;
};

// 🚪 Logout API (Clears HttpOnly Cookies from backend)
export const adminLogoutApi = async () => {
  const response = await axiosInstance.post("/accounts/logout");
  return response.data;
};