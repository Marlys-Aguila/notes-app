import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() categoryData: Category) {
        return this.categoryService.create(categoryData);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() categoryData: Category) {
        return this.categoryService.update(id, categoryData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoryService.remove(id);
    }
}
