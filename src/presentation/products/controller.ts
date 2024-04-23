import { Request, Response } from "express";
import { CustomError, CreateProductDto, PaginationDto, CategoryEntity } from "../../domain";
import { ProductService } from "../services/products.service";
import { CategoryService } from "../services/categories.service";

export class ProductController {
  constructor(
    public readonly productService: ProductService,
    public readonly categoryService: CategoryService
  ) {}

  private handleError = (error: unknown, res: Response) => {
    console.error(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  getAll = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create({
      page: Number(page),
      limit: Number(limit),
    });

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!paginationDto) {
      return res.status(500).json({ message: "Internal server error" });
    }

    this.productService
      .getAll(paginationDto)
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((error) => this.handleError(error, res));
  };

  create = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDto.create(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!createProductDto) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // this.categoryService.getByName(createProductDto.category).then((category) => {
    this.categoryService.get(createProductDto.category).then((category) => {
      const categoryEntity = CategoryEntity.fromObject(category);

      this.productService
        .create(createProductDto, req.body.user, categoryEntity)
        .then((product) => {
          res.status(201).json(product);
        })
        .catch((error) => this.handleError(error, res));
    })
  };
}
