import { Injectable } from '@nestjs/common';
import { CreateThreadInput } from './dto/create-thread.input';
import { UpdateThreadInput } from './dto/update-thread.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './entities/thread.entity';
import { User } from '../users/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private threadsRepository: Repository<Thread>,
  ) {}

  async create(createThreadInput: CreateThreadInput, user: User) {
    const newThread = await this.threadsRepository.save({
      ...createThreadInput,
      authorId: user.id,
    });
    return newThread;
  }

  async findAll(): Promise<Thread[]> {
    return await this.threadsRepository.find({ relations: ['posts'] });
  }

  async findOne(id: number) {
    return await this.threadsRepository.findOne(
      { id },
      {
        relations: [
          'category',
          'author',
          'posts',
          'posts.author',
          'latestPost',
        ],
      },
    );
  }

  async update(updateThreadInput: UpdateThreadInput, user) {
    const thread = await this.threadsRepository.findOne(updateThreadInput.id);

    if (user.id === thread.authorId || user.isAdmin) {
      const updateThread = await this.threadsRepository.update(
        {
          id: updateThreadInput.id,
        },
        { ...updateThreadInput, authorId: thread.authorId },
      );
      if (!updateThread.affected) {
        throw new HttpException(
          'Thread Update Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return updateThreadInput;
    } else {
      throw new HttpException(
        'You are not authorized to update this post',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async remove(id: number, user) {
    if (!user.isAdmin) {
      throw new HttpException(
        'Only admin can remove thread',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deleteThread = await this.threadsRepository.softDelete(id);
    if (!deleteThread.affected) {
      throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
    }
    return 'Thread removed';
  }

  async updateLatestPost(threadId: number, post: Post) {
    //update updated_at collumn when thread new post created
    await this.threadsRepository.update(
      { id: threadId },
      {
        latestPost: post,
      },
    );
    return 'latestPost field updated';
  }
}
