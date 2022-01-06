import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class PostsAndCount {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Int)
  postsCount: number;
}
