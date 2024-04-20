import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, UserEntity } from "../../domain";

export class AuthMiddleware {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

  auth = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const authorizationData = authorization.split(" ");

    if (authorizationData.length !== 2) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const scheme = authorizationData[0];

    if (scheme !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authorizationData[1];

    const jwtPayload = this.jwtAdapter.verify<{ id: string }>(token);
    if (!jwtPayload) {
      throw CustomError.badRequest("Invalid token");
    }

    if (typeof jwtPayload === "string") {
      throw CustomError.badRequest("Invalid token");
    }

    const user = await UserModel.findById(jwtPayload.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.body.user = UserEntity.fromObject(user);

    next();
  }
}
