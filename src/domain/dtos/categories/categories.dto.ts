export class CreateCategoryDto {
  private constructor(
    public readonly name: string,
    public readonly available?: boolean
  ) {}

  static create(obj: {
    [key: string]: any;
  }): [string | null, CreateCategoryDto?] {
    const { name, available } = obj;
    if (!name) {
      return ["name is required"];
    }

    let availableBool: boolean | undefined;
    if (typeof available !== "boolean") {
      availableBool = available === "true";
    } else if (available !== undefined) {
      availableBool = available;
    }


    return [null, new CreateCategoryDto(name, availableBool)];
  }
}
