import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ThreadsService } from './threads.service';
import { Thread } from './entities/thread.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { CreateThreadInput } from './dto/create-thread.input';
import { UpdateThreadInput } from './dto/update-thread.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-auth-user.decorator';

@Resolver(() => Thread)
export class ThreadsResolver {
  constructor(private readonly threadsService: ThreadsService) {}

  @Mutation(() => Thread)
  @UseGuards(GqlAuthGuard)
  async createThread(
    @Args('createThreadInput') createThreadInput: CreateThreadInput,
    @CurrentUser() user: User,
  ) {
    return this.threadsService.create(createThreadInput, user);
  }

  @Query(() => [Thread], { name: 'threads' })
  async findAll() {
    return this.threadsService.findAll();
  }

  @Query(() => Thread, { name: 'thread' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.threadsService.findOne(id);
  }

  @Mutation(() => Thread)
  async updateThread(
    @Args('updateThreadInput')
    updateThreadInput: UpdateThreadInput,
    @CurrentUser() user: User,
  ) {
    return this.threadsService.update(updateThreadInput, user);
  }

  @Mutation(() => String)
  async removeThread(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.threadsService.remove(id, user);
  }

  @Mutation(() => String)
  async updateLatestPost(
    @Args('threadId', { type: () => Int }) threadId: number,
    @Args('post', { type: () => Int }) post: Post,
  ) {
    return this.threadsService.updateLatestPost(threadId, post);
  }
}
