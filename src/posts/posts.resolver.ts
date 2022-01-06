import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { PostsAndCount } from './entities/postsAndCount.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-auth-user.decorator';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create(createPostInput, user);
  }

  @Query(() => [Post], { name: 'posts' })
  async findAll() {
    return this.postsService.findAll();
  }

  @Query(() => [Post], { name: 'postsByThreadId' })
  async findByThreadId(
    @Args('id', { type: () => Int }) threadId: number,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
  ) {
    return this.postsService.findAllByThreadId(threadId, take, skip);
  }

  @Query(() => [Post], { name: 'postsByAuthorId' })
  async findByAuthorId(
    @Args('id', { type: () => Int }) authorId: number,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('order') order: 'ASC' | 'DESC',
  ) {
    return this.postsService.findAllByAuthorId(authorId, take, skip, order);
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(updatePostInput, user);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async removePost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.remove(id, user);
  }

  @Query(() => [Post], { name: 'likedPosts' })
  async findAllLikedPosts(
    @Args('id', { type: () => Int }) userId: number,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
    @Args('order') order: string,
  ) {
    return this.postsService.findAllLikedPosts(userId, take, skip, order);
  }

  @Mutation(() => String, { name: 'likePost' })
  @UseGuards(GqlAuthGuard)
  async likePost(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: User,
  ) {
    return this.postsService.likePost(postId, user);
  }

  @Query(() => PostsAndCount, { name: 'postsAndCount' })
  async findPostsAndCount(
    @Args('id', { type: () => Int }) id: number,
    @Args('take', { type: () => Int }) take: number,
    @Args('skip', { type: () => Int }) skip: number,
  ) {
    return this.postsService.findPostsAndCount(id, take, skip);
  }
}
