import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    //hash password
    const rounds = 10;
    const password = await bcrypt.hash(createUserInput.password, rounds);
    //set default avatar
    const avatar = createUserInput.avatar
      ? createUserInput.avatar
      : 'https://cdn.fakercloud.com/avatars/grrr_nl_128.jpg';
    const newUser = await this.usersRepository.save({
      ...createUserInput,
      avatar,
      password,
    });
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['posts', 'threads'],
    });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(
      { id },
      { relations: ['posts', 'threads', 'likedPosts'] },
    );
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      hashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findOne(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return await this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }

  async findOneByUsername(username: string) {
    const user = await this.usersRepository.findOne({ username });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this username does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const result = await this.usersRepository.update(
      {
        id,
      },
      { ...updateUserInput },
    );
    if (!result.affected) {
      throw new HttpException(
        'User Update Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return updateUserInput;
    }
  }

  async remove(id: number, user: User) {
    if (user.id === id || user.isAdmin) {
      const result = await this.usersRepository.softDelete(id);
      if (!result.affected) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }
      return 'User Removed';
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
