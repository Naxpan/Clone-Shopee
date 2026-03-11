import axiosInstance from "../axiosConfig";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types";
import { UserRole } from "../types";

export const authService = {
  // Đăng ký tài khoản mới
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response: any = await axiosInstance.post(
        "/auth/register",
        userData,
      );

      // Lưu token và user info nếu thành công
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error: any) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response: any = await axiosInstance.post(
        "/auth/login",
        credentials,
      );

      // Lưu token và user info nếu thành công
      if (response.success && response.token) {
        localStorage.setItem("token", response.token);
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "/";
  },

  // Lấy thông tin user hiện tại từ server
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response: any = await axiosInstance.get("/auth/me");
      return response.data || response;
    } catch (error: any) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Kiểm tra xem user đã đăng nhập chưa (và token chưa hết hạn)
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Lấy user từ localStorage
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Kiểm tra xem user có phải admin không
  isAdmin: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === UserRole.ADMIN;
  },

  // Redirect sau khi login dựa vào role
  redirectAfterLogin: () => {
    const user = authService.getStoredUser();
    if (user?.role === UserRole.ADMIN) {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/";
    }
  },
};
