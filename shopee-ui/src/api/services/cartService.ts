import axiosInstance from "../axiosConfig";
import type { CartItem } from "../types";

export const cartService = {
  // Lấy giỏ hàng của user
  getCart: async (): Promise<CartItem[]> => {
    try {
      const response: any = await axiosInstance.get("/cart");
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching cart:", error);
      return [];
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (
    productId: string | number,
    quantity: number = 1,
  ): Promise<CartItem | null> => {
    try {
      const response: any = await axiosInstance.post("/cart/add", {
        productId,
        quantity,
      });
      return response.data || null;
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem: async (
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem | null> => {
    try {
      const response: any = await axiosInstance.put(`/cart/${cartItemId}`, {
        quantity,
      });
      return response.data || null;
    } catch (error: any) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: async (cartItemId: string): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/cart/${cartItemId}`);
      return true;
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      return false;
    }
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<boolean> => {
    try {
      await axiosInstance.delete("/cart");
      return true;
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      return false;
    }
  },

  // Đồng bộ giỏ hàng từ localStorage lên server (khi user login)
  syncCart: async (
    localCartItems: { productId: number; quantity: number }[],
  ): Promise<CartItem[]> => {
    try {
      const response: any = await axiosInstance.post("/cart/sync", {
        items: localCartItems,
      });
      return response.data || [];
    } catch (error: any) {
      console.error("Error syncing cart:", error);
      return [];
    }
  },
};
