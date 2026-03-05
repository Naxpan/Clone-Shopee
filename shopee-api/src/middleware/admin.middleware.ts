import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { User, UserRole } from "../models/user";

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Kiểm tra xem user đã đăng nhập chưa
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Lấy thông tin user từ database
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Kiểm tra role
    if (user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
