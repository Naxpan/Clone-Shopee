import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, UserRole } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const recreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // Xóa admin cũ nếu có
    const deleted = await User.deleteOne({ email: "admin@shopee.com" });
    if (deleted.deletedCount > 0) {
      console.log("🗑️  Deleted old admin user");
    }

    // Tạo password hash mới
    const hashedPassword = await bcrypt.hash("admin123", 10);
    console.log("🔐 New password hash:", hashedPassword);

    // Tạo admin mới
    const admin = await User.create({
      username: "admin",
      email: "admin@shopee.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@shopee.com");
    console.log("🔑 Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

recreateAdmin();
