import { ProductModel } from "../../data";
import {
  CreateProductDto,
  CustomError,
  PaginationDto,
  UserEntity,
  CategoryEntity,
} from "../../domain";

export class ProductService {
  getAll = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .populate("user", "name email")
          .populate("category", "name")
          .skip((page - 1) * limit)
          .limit(limit),
      ]);
      const totalPages = Math.ceil(total / limit);

      if (page > totalPages) {
        throw CustomError.badRequest("Page out of range");
      }

      return {
        data: products,
        page,
        limit,
        total,
        totalPages,
        nextPage:
          page < totalPages
            ? `/api/products?page=${page + 1}&limit=${limit}`
            : null,
        previousPage:
          page > 1 ? `/api/products?page=${page + 1}&limit=${limit}` : null,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internal("Internal server error");
    }
  };

  create = async (
    createProductDto: CreateProductDto,
    user: UserEntity,
    category: CategoryEntity
  ) => {
    const { name, available, price, description } = createProductDto;
    const exists = await ProductModel.findOne({ name });

    if (exists) {
      throw CustomError.badRequest("Product already exists");
    }
    try {
      const product = new ProductModel({
        name,
        available,
        price,
        description,
        user: user.id,
        category: category.id,
      });
      return product.save();
    } catch (error) {
      throw CustomError.internal("Internal server error");
    }
  };
}
