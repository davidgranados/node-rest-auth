import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService, EmailService } from "../services";
import { envs, JwtAdapter } from "../../config";
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const jwtAdapter = new JwtAdapter(envs.JWT_SECRET, envs.JWT_EXPIRES_IN);
    const emailService = new EmailService(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY);
    const authService = new AuthService(jwtAdapter, emailService);
    const controller = new AuthController(authService);

    router.post("/login", controller.login);
    router.post("/register", controller.register);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
