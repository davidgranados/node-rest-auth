import { Request, Response } from "express";
import { CustomError, CreateCategoryDto, PaginationDto } from "../../domain";
import { CategoryService } from "../services/categories.service";

export class CategoryController {
  constructor(public readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    console.error(error)
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

    this.categoryService
      .getAll(paginationDto)
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((error) => this.handleError(error, res));
  };

  create = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!createCategoryDto) {
      return res.status(500).json({ message: "Internal server error" });
    }

    this.categoryService
      .create(createCategoryDto, req.body.user)
      .then((category) => {
        res.status(201).json(category);
      })
      .catch((error) => this.handleError(error, res));
  };
}
