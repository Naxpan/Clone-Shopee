import { Response } from "express";
import { User } from "../models/user";
import { Product } from "../models/product";
import { AuthRequest } from "../middleware/auth.middleware";

export const adminController = {
  // Dashboard: trả số liệu thực từ DB
  getDashboard: async (req: AuthRequest, res: Response) => {
    try {
      const [totalUsers, totalProducts, totalSellers] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "seller" }),
      ]);

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalProducts,
          totalSellers,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },

  // Lấy danh sách tất cả users (không trả password)
  getUsers: async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20, role } = req.query;
      const query: any = {};
      if (role) query.role = role;

      const skip = (Number(page) - 1) * Number(limit);
      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 }),
        User.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },

  // Xoá user theo ID
  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  },

  // Lấy danh sách tất cả products (admin view)
  getProducts: async (req: AuthRequest, res: Response) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [products, total] = await Promise.all([
        Product.find().skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Product.countDocuments(),
      ]);

      return res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  },

  // Xoá product theo ID
  deleteProduct: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      return res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ success: false, message: error.message || "Server error" });
    }
  },
};
