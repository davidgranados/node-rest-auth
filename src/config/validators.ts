import mongoose from "mongoose";

export class Validators {
  static isMongoId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }
}
