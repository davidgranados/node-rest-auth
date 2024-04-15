import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { envs, JwtAdapter } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const jwtAdapter = new JwtAdapter(envs.JWT_SECRET, envs.JWT_EXPIRES_IN);
    const authService = new AuthService(jwtAdapter);
    const controller = new AuthController(authService);

    router.post("/login", controller.login);
    router.post("/register", controller.register);
    router.post("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
