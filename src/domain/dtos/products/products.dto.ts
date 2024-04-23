import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public readonly description?: string,
    public readonly available?: boolean
  ) {}

  static create(obj: {
    [key: string]: any;
  }): [string | null, CreateProductDto?] {
    const { name, price, category, description, available } = obj;
    if (!name) {
      return ["name is required"];
    }
    if (!price) {
      return ["price is required"];
    }
    if (typeof price !== "number") {
      return ["price must be a number"];
    }
    if (description && typeof description !== "string") {
      return ["description must be a string"];
    }
    if (!category) {
      return ["category is required"];
    } else if (!Validators.isMongoId(category)) {
      return ["category must be a valid id"];
    }

    let availableBool: boolean | undefined;
    if (typeof available !== "boolean") {
      availableBool = available === "true";
    } else if (available !== undefined) {
      availableBool = available;
    }

    return [null, new CreateProductDto(name, price, category, description, availableBool)];
  }
}
