import bcrypt from "bcryptjs";

export const bcryptAdapter = {
  hash(value: string, salt: number = 10): string {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(salt));
  },
  compare(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  },
};
