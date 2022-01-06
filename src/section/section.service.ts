import { Injectable } from '@nestjs/common';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from './entities/section.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}
  async create(createSectionInput: CreateSectionInput, user: User) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can create new section',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const newSection = await this.sectionsRepository.save({
      section: createSectionInput.section,
    });
    return newSection;
  }

  async findAll(): Promise<Section[]> {
    return await this.sectionsRepository.find({
      relations: ['categories', 'categories.threads'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    return await this.sectionsRepository.findOne({ id });
  }

  async update(id: number, updateSectionInput: UpdateSectionInput, user: User) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can update section',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const updateSection = await this.sectionsRepository.update(
      {
        id,
      },
      { ...updateSectionInput },
    );
    if (!updateSection.affected) {
      throw new HttpException(
        'Section Update Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updateSectionInput;
  }

  async remove(id: number, user: User) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can remove section',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteSection = await this.sectionsRepository.softDelete(id);
    if (!deleteSection.affected) {
      throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    }
    return 'Section removed';
  }
}
