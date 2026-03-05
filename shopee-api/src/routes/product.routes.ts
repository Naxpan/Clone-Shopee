import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/search", productController.searchProducts);

export default router;
