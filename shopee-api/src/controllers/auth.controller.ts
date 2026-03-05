import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../models/user";
import { generateToken } from "../utils/jwt.util";

export const authController = {
  // Đăng ký
  register: async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // --- Validate input ---
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng điền đầy đủ thông tin (username, email, password)",
        });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Email không đúng định dạng",
        });
      }

      if (username.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Tên người dùng phải có ít nhất 3 ký tự",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu phải có ít nhất 6 ký tự",
        });
      }

      // --- Kiểm tra trùng email ---
      const existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email đã được sử dụng",
        });
      }

      // --- Kiểm tra trùng username ---
      const existingUsername = await User.findOne({
        username: username.trim(),
      });
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "Tên người dùng đã được sử dụng",
        });
      }

      // --- Hash password ---
      const hashedPassword = await bcrypt.hash(password, 10);

      // --- Tạo user mới ---
      const user = await User.create({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: UserRole.USER,
      });

      // --- Generate token (auto-login) ---
      const token = generateToken(user._id.toString());

      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      // Mongoose duplicate key (race condition sau khi check trên)
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        const message =
          field === "email"
            ? "Email đã được sử dụng"
            : "Tên người dùng đã được sử dụng";
        return res.status(409).json({ success: false, message });
      }
      return res.status(500).json({
        success: false,
        message: "Lỗi server. Vui lòng thử lại sau.",
      });
    }
  },

  // Đăng nhập
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Tìm user
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user._id.toString());

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role, // ← Trả về role
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },

  // Get current user
  getCurrentUser: async (req: any, res: Response) => {
    try {
      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  },

  // Logout (client-side chỉ cần xóa token)
  logout: async (req: any, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  },
};
