import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";

export class ProductEntity {
  private constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public price: number,
    public description: string,
    public user: UserEntity,
    public category: CategoryEntity
  ) {}

  static fromObject(obj: any): ProductEntity {
    const { id, _id, name, available, price, description, user, category } =
      obj;
    if (!id && !_id) {
      throw new Error("Id is required");
    }
    if (!name) {
      throw new Error("Name is required");
    }
    if (available === undefined) {
      throw new Error("Available is required");
    }
    if (price === undefined) {
      throw new Error("Price is required");
    }
    if (!user) {
      throw new Error("User is required");
    }
    if (!category) {
      throw new Error("Category is required");
    }
    return new ProductEntity(
      id ?? _id,
      name,
      available,
      price,
      description,
      user,
      category
    );
  }
}
