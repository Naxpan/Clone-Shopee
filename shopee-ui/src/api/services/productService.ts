import axiosInstance from "../axiosConfig";
import type { Product } from "../types";

export interface ProductSearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "bestseller";
  page?: number;
  limit?: number;
}

export const productService = {
  // Lấy tất cả sản phẩm
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<Product[]> => {
    try {
      const response: any = await axiosInstance.get("/products", { params });
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id: string | number): Promise<Product | null> => {
    try {
      const response: any = await axiosInstance.get(`/products/${id}`);
      return response.data || null;
    } catch (error: any) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (params: ProductSearchParams): Promise<Product[]> => {
    try {
      const response: any = await axiosInstance.get("/products/search", {
        params,
      });
      return response.data || [];
    } catch (error: any) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response: any = await axiosInstance.get(
        `/products/category/${category}`,
      );
      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching products in category ${category}:`, error);
      return [];
    }
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (
    productId: string | number,
    limit: number = 10,
  ): Promise<Product[]> => {
    try {
      const response: any = await axiosInstance.get(
        `/products/${productId}/related`,
        {
          params: { limit },
        },
      );
      return response.data || [];
    } catch (error: any) {
      console.error(`Error fetching related products for ${productId}:`, error);
      return [];
    }
  },

  // Lấy sản phẩm gợi ý (loại trừ một số ID)
  getSuggestedProducts: async (
    excludeIds: number[] = [],
    limit: number = 10,
  ): Promise<Product[]> => {
    try {
      const response: any = await axiosInstance.get("/products/suggestions", {
        params: {
          exclude: excludeIds.join(","),
          limit,
        },
      });
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching suggested products:", error);
      return [];
    }
  },

  // Lấy danh sách categories
  getCategories: async (): Promise<string[]> => {
    try {
      const response: any = await axiosInstance.get("/products/categories");
      return response.data || [];
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
