// User
export enum UserRole {
  USER = "user",
  SELLER = "seller",
  ADMIN = "admin",
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Product types
export interface Product {
  _id?: string; // MongoDB ObjectId (khi lấy từ BE)
  id?: number; // numeric id (dùng cho mock/local data)
  name: string;
  category: string;
  image: string;
  price_old: number;
  sale_off_percent: number;
  sold: number;
  brand: string;
  origin: string;
  rating: number;
  liked: boolean;
  favorite: boolean;
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string;
}

export interface CartResponse {
  success: boolean;
  data: CartItem[];
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
