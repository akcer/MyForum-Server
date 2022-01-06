import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Thread } from '../../threads/entities/thread.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  post: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Thread, { nullable: true })
  @ManyToOne(() => Thread, (thread) => thread.id)
  thread?: Thread;

  @Field(() => Int, { nullable: true })
  @Column()
  threadId?: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id)
  author?: User;

  @Field(() => Int, { nullable: true })
  @Column()
  authorId?: number;

  @Field()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.likedPosts)
  @JoinTable()
  likingUsers: User[];
}
