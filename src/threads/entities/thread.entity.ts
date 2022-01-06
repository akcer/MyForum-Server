import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
@Entity()
export class Thread {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column()
  threadTitle: string;

  @Field({ nullable: true })
  @Column()
  threadDescription?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @Field(() => Int, { nullable: true })
  @Column()
  authorId: number;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @Field(() => Int, { nullable: true })
  @Column()
  categoryId: number;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.thread)
  posts: Post[];

  @Field(() => Int)
  postsCount: number;

  @Field(() => Post, { nullable: true })
  @OneToOne(() => Post)
  @JoinColumn()
  latestPost: Post;
}
