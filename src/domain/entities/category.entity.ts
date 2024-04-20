import { UserEntity } from "./user.entity";

export class CategoryEntity {
  private constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public user: UserEntity
  ) {}

  static fromObject(obj: any): CategoryEntity {
    const { id, _id, name, available, user } = obj;
    if (!id && !_id) {
      throw new Error("Id is required");
    }
    if (!name) {
      throw new Error("Name is required");
    }
    if (available === undefined) {
      throw new Error("Available is required");
    }
    if (!user) {
      throw new Error("User is required");
    }
    return new CategoryEntity(id ?? _id, name, available, user);
  }
}
