import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Tạo axios instance với config mặc định
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Chạy trước mỗi request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Nếu có token, thêm vào Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request để debug (chỉ hiện trong development)
    if (import.meta.env.DEV) {
      console.log("📤 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor - Chạy sau mỗi response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response để debug
    if (import.meta.env.DEV) {
      console.log("📥 Response:", {
        status: response.status,
        data: response.data,
      });
    }

    // Trả về data thay vì toàn bộ response
    return response.data;
  },
  (error: AxiosError) => {
    // Xử lý lỗi
    if (error.response) {
      const status = error.response.status;

      console.error("❌ Response Error:", {
        status,
        data: error.response.data,
      });

      // Xử lý các trường hợp lỗi cụ thể
      switch (status) {
        case 401:
          // Unauthorized - Token hết hạn hoặc không hợp lệ
          console.log("🔐 Token expired or invalid");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Chuyển về trang login (nếu không phải đang ở trang login)
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
          break;

        case 403:
          // Forbidden - Không có quyền truy cập
          console.log("⛔ Access forbidden");
          break;

        case 404:
          // Not Found
          console.log("🔍 Resource not found");
          break;

        case 500:
          // Internal Server Error
          console.log("🔥 Server error");
          break;
      }

      // Trả về error message từ server
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("📡 No response from server:", error.request);
      return Promise.reject({
        success: false,
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      });
    } else {
      // Lỗi khác
      console.error("⚠️ Request setup error:", error.message);
      return Promise.reject({
        success: false,
        message: error.message,
      });
    }
  },
);

export default axiosInstance;
