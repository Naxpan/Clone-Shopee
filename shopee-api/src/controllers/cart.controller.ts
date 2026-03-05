import { Request, Response } from "express";
import { CartItem } from "../models/cartitem";
import { Product } from "../models/product";

// Extend Request type để có userId từ middleware
interface AuthRequest extends Request {
  userId?: string;
}

export const cartController = {
  // Lấy giỏ hàng của user
  getCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      const cartItems = await CartItem.find({ userId }).populate("productId");

      return res.json({
        success: true,
        data: cartItems,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { productId, quantity = 1 } = req.body;

      // Kiểm tra sản phẩm có tồn tại không
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Kiểm tra xem sản phẩm đã có trong giỏ chưa
      let cartItem = await CartItem.findOne({ userId, productId });

      if (cartItem) {
        // Nếu đã có thì tăng số lượng
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        // Nếu chưa có thì tạo mới
        cartItem = await CartItem.create({
          userId,
          productId,
          quantity,
        });
      }

      // Populate product info
      await cartItem.populate("productId");

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: cartItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }

      const cartItem = await CartItem.findOne({
        _id: id,
        userId,
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      cartItem.quantity = quantity;
      await cartItem.save();
      await cartItem.populate("productId");

      return res.json({
        success: true,
        message: "Cart item updated",
        data: cartItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;

      const cartItem = await CartItem.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      return res.json({
        success: true,
        message: "Product removed from cart",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;

      await CartItem.deleteMany({ userId });

      return res.json({
        success: true,
        message: "Cart cleared",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
