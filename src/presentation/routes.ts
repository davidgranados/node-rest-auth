import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoriesRoutes } from "./categories/routes";
import { ProductsRoutes } from "./products/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/categories", CategoriesRoutes.routes);
    router.use("/api/products", ProductsRoutes.routes);

    return router;
  }
}
