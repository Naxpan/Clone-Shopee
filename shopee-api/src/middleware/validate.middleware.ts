// middleware/validate.middleware.ts
import { Request, Response, NextFunction } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, email, password } = req.body;
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!username?.trim() || username.trim().length < 3)
    return res
      .status(400)
      .json({ success: false, message: "Username phải ≥ 3 ký tự" });

  if (!email || !emailRegex.test(email))
    return res
      .status(400)
      .json({ success: false, message: "Email không đúng định dạng" });

  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ success: false, message: "Mật khẩu phải ≥ 6 ký tự" });

  next();
};
