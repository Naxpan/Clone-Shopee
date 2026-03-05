import { Request, Response } from "express";
import { Product } from "../models/product";

export const productController = {
  // Lấy tất cả sản phẩm với phân trang và filter
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        sort = "createdAt",
        order = "desc",
      } = req.query;

      const query: any = {};
      if (category) {
        query.category = category;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const sortOrder = order === "asc" ? 1 : -1;

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort({ [sort as string]: sortOrder })
          .skip(skip)
          .limit(Number(limit)),
        Product.countDocuments(query),
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
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (req: Request, res: Response) => {
    try {
      const { q, page = 1, limit = 20 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      const skip = (Number(page) - 1) * Number(limit);

      const searchQuery = {
        $or: [
          { name: { $regex: q as string, $options: "i" } },
          { description: { $regex: q as string, $options: "i" } },
          { category: { $regex: q as string, $options: "i" } },
        ],
      };

      const [products, total] = await Promise.all([
        Product.find(searchQuery).skip(skip).limit(Number(limit)),
        Product.countDocuments(searchQuery),
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
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
