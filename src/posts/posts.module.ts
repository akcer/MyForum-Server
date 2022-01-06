import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ThreadsModule } from '../threads/threads.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), ThreadsModule],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
