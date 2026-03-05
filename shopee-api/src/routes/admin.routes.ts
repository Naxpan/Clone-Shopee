import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/admin.middleware";
import { adminController } from "../controllers/admin.controller";

const router = Router();

// Protect tất cả admin routes
router.use(authenticate);
router.use(isAdmin);

// Dashboard stats
router.get("/dashboard", adminController.getDashboard);

// Quản lý users
router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);

// Quản lý products
router.get("/products", adminController.getProducts);
router.delete("/products/:id", adminController.deleteProduct);

export default router;
