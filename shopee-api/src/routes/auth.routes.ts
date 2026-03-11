import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRegister } from "../middleware/validate.middleware";

const router = Router();

// Public routes
router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authenticate, authController.logout);

export default router;
