import axiosInstance from "../axiosConfig";

export const adminService = {
  // Lấy dashboard stats
  getDashboard: async () => {
    try {
      const response: any = await axiosInstance.get("/admin/dashboard");
      return response.data || null;
    } catch (error: any) {
      console.error("Error fetching dashboard:", error);
      throw error;
    }
  },

  // Lấy danh sách users
  getAllUsers: async () => {
    try {
      const response: any = await axiosInstance.get("/admin/users");
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Lấy danh sách products (admin view)
  getAllProducts: async () => {
    try {
      const response: any = await axiosInstance.get("/admin/products");
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};
