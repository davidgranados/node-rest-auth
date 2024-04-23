import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "../services/products.service";
import { AuthMiddleware } from "../middlewares";
import { JwtAdapter, envs } from "../../config";
import { CategoryService } from "../services/categories.service";

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();
    const productService = new ProductService();
    const categoryService = new CategoryService();
    const controller = new ProductController(productService, categoryService);
    const jwtAdapter = new JwtAdapter(envs.JWT_SECRET, envs.JWT_EXPIRES_IN);
    const authMiddleware = new AuthMiddleware(jwtAdapter);
    router.get("/", controller.getAll);
    router.post("/", authMiddleware.auth, controller.create);

    return router;
  }
}
