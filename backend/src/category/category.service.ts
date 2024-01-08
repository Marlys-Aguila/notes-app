import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    create(categoryData: Category) {
        return this.categoryRepository.save(categoryData);
    }

    findAll() {
        return this.categoryRepository.find();
    }

    findOne(id: number) {
        return this.categoryRepository.findOne({
            where: { categoryId: id }
        });
    }

    async update(id: number, categoryData: Category) {
        await this.categoryRepository.update(id, categoryData);
        return this.categoryRepository.findOne({
            where: { categoryId: id }
        });
    }

    remove(id: number) {
        return this.categoryRepository.delete(id);
    }
}
