import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsResolver } from './threads.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thread, Post])],
  providers: [ThreadsResolver, ThreadsService],
  exports: [ThreadsResolver],
})
export class ThreadsModule {}
