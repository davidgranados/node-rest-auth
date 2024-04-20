import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "../services/categories.service";
import { AuthMiddleware } from "../middlewares";
import { JwtAdapter, envs } from "../../config";

export class CategoriesRoutes {
  static get routes(): Router {
    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);
    const jwtAdapter = new JwtAdapter(envs.JWT_SECRET, envs.JWT_EXPIRES_IN);
    const authMiddleware = new AuthMiddleware(jwtAdapter);
    router.get("/", controller.getAll);
    router.post("/", authMiddleware.auth, controller.create);

    return router;
  }
}
