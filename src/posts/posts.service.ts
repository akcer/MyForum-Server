import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { ThreadsResolver } from '../threads/threads.resolver';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private threadsResolver: ThreadsResolver,
  ) {}
  async create(createPostInput: CreatePostInput, user: User) {
    const newPost = await this.postsRepository.save({
      ...createPostInput,
      authorId: user.id,
    });
    //update Thread LatestPost column when new post saved
    //https://github.com/typeorm/typeorm/issues/5378#issuecomment-632174484
    await this.threadsResolver.updateLatestPost(
      createPostInput.threadId,
      newPost,
    );
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['thread', 'author'],
      withDeleted: true,
    });
    return posts;
  }

  async findAllByThreadId(
    threadId: number,
    take: number,
    skip: number,
  ): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['author', 'thread'],
      withDeleted: true,
      where: { threadId },
      take: take,
      skip: skip,
    });
    return posts;
  }

  async findAllByAuthorId(
    authorId: number,
    take: number,
    skip: number,
    order: 'ASC' | 'DESC',
  ): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: ['author', 'thread', 'likingUsers'],
      withDeleted: true,
      where: { authorId },
      order: {
        id: order,
      },
      take,
      skip,
    });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      relations: ['likingUsers'],
      withDeleted: true,
      where: { id },
    });
    if (post) {
      return post;
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  async update(updatePostInput: UpdatePostInput, user) {
    const post = await this.postsRepository.findOne(updatePostInput.id);

    if (user.id === post.id || user.isAdmin) {
      const updatePost = await this.postsRepository.update(
        {
          id: updatePostInput.id,
        },
        { ...updatePostInput, authorId: post.authorId },
      );
      if (updatePost.affected === 1) {
        return updatePostInput;
      } else {
        throw new HttpException(
          'Post Update Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      throw new HttpException(
        'You are not authorized to update this post',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async remove(id: number, user) {
    const post = await this.postsRepository.findOne(id);
    if (user.id === post.authorId || user.isAdmin) {
      const deletePost = await this.postsRepository.softDelete(id);
      if (!deletePost.affected) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return 'Post Removed';
    } else {
      throw new HttpException(
        'You are not authorized to remove this post',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAllLikedPosts(
    userId: number,
    take: number,
    skip: number,
    order: any,
  ): Promise<Post[]> {
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.likingUsers', 'user')
      .where('user.id = :id', { id: userId })
      .skip(skip)
      .take(take)
      .orderBy('post.id', order)
      .getMany();

    return posts;
  }

  async likePost(postId: number, user: User): Promise<string> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['likingUsers'],
    });
    //check if post is already liked
    const isAlreadyLiked =
      post.likingUsers.findIndex((u) => u.id === user.id) > -1;

    const query = await this.postsRepository
      .createQueryBuilder('post')
      .relation(Post, 'likingUsers')
      .of(postId);
    isAlreadyLiked ? query.remove(user.id) : query.add(user.id);

    return 'Post Liked';
  }

  async findPostsAndCount(id: number, take: number, skip: number) {
    const [posts, postsCount] = await this.postsRepository.findAndCount({
      relations: ['author', 'likingUsers'],
      withDeleted: true,
      where: {
        threadId: id,
      },
      take,
      skip,
    });
    return { posts, postsCount };
  }
}
