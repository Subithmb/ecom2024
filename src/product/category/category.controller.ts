import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './categoryDto';

@Controller('category')
export class CategoryController {
  /* eslint-disable */
  constructor(private readonly categoryService: CategoryService) {}
  /* eslint-enable */

  @Post()
  async create(@Body() createCategoryDto: CategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CategoryDto>,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }

  @Patch(':id/toggle-active')
  async toggleIsActive(@Param('id') id: string) {
    return this.categoryService.toggleIsActive(id);
  }
}
