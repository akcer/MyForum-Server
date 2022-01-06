import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const newCategory = await this.categoriesRepository.save({
      ...createCategoryInput,
    });
    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find({
      relations: ['section', 'threads'],
    });
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.threads', 'threads')
      .leftJoinAndSelect('threads.author', 'author')
      .leftJoinAndSelect('threads.posts', 'posts')
      .leftJoinAndSelect('threads.latestPost', 'latestPost')
      .leftJoinAndSelect('latestPost.author', 'auth')
      .loadRelationCountAndMap('threads.postsCount', 'threads.posts')
      .getOne();
    return category;
  }

  async update(
    id: number,
    updateCategoryInput: UpdateCategoryInput,
    user: User,
  ) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can update category',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const updateCategory = await this.categoriesRepository.update(
      {
        id,
      },
      { ...updateCategoryInput },
    );
    if (!updateCategory.affected) {
      throw new HttpException(
        'Category Update Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateCategoryInput;
  }

  async remove(id: number, user: User) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can remove category',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteCategory = await this.categoriesRepository.softDelete(id);
    if (!deleteCategory.affected) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return 'Category Removed';
  }
}
