import { CategoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  get = async (id: string) => {
    const category = await CategoryModel.findById(id).populate(
      "user",
      "name email"
    );
    if (!category) {
      throw CustomError.notFound("Category not found");
    }
    return category;
  };

  getByName = async (name: string) => {
    const category = await CategoryModel.findOne({ name }).populate(
      "user",
      "name email"
    );
    if (!category) {
      throw CustomError.notFound("Category not found");
    }
    return category;
  };

  getAll = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .populate("user", "name email")
          .skip((page - 1) * limit)
          .limit(limit),
      ]);
      const totalPages = Math.ceil(total / limit);

      if (page > totalPages) {
        throw CustomError.badRequest("Page out of range");
      }

      return {
        data: categories,
        page,
        limit,
        total,
        totalPages,
        nextPage:
          page < totalPages
            ? `/api/categories?page=${page + 1}&limit=${limit}`
            : null,
        previousPage:
          page > 1 ? `/api/categories?page=${page + 1}&limit=${limit}` : null,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Internal server error");
    }
  };

  create = async (createCategoryDto: CreateCategoryDto, user: UserEntity) => {
    const { name, available } = createCategoryDto;
    const exists = await CategoryModel.findOne({ name });

    if (exists) {
      throw CustomError.badRequest("Category already exists");
    }
    try {
      const category = new CategoryModel({ name, available, user: user.id });
      return category.save();
    } catch (error) {
      throw CustomError.internal("Internal server error");
    }
  };
}
