import jwt from "jsonwebtoken";

export class JwtAdapter {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}

  public sign(payload: any) {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        this.secret,
        { expiresIn: this.expiresIn },
        (err, token) => {
          if (err || !token) {
            resolve(null);
          }
          resolve(token);
        }
      );
    });
  }

  public verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
