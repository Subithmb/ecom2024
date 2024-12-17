import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from './categoryDto';
import { Category } from './category.schema';

@Injectable()
export class CategoryService {
  /* eslint-disable */
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  /* eslint-enable */
  async create(createCategoryDto: CategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: Partial<CategoryDto>,
  ): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateCategoryDto,
      { new: true },
    );
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async delete(id: string): Promise<Category> {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async toggleIsActive(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category || category.isDeleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    category.isActive = !category.isActive;
    return category.save();
  }
}
