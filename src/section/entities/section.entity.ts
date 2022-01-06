import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@ObjectType()
@Entity()
export class Section {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ length: 100, unique: true })
  section: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.section)
  categories: Category[];
}
