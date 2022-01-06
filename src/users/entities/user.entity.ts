import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { Thread } from '../../threads/entities/thread.entity';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field()
  @Column({ length: 100, unique: true })
  username?: string;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email?: string;

  @Field()
  @Column()
  password?: string;

  @Field()
  @Column()
  avatar?: string;

  @Field()
  @Column({ default: false })
  isAdmin?: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Field(() => [Thread])
  @OneToMany(() => Thread, (thread) => thread.author)
  threads?: Thread[];

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];

  @Field(() => [Post])
  @ManyToMany(() => Post, (post) => post.likingUsers)
  likedPosts?: Post[];

  @Field()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({
    nullable: true,
  })
  hashedRefreshToken: string;
}
