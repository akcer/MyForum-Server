import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Section } from '../../section/entities/section.entity';
import { Thread } from '../../threads/entities/thread.entity';

@ObjectType()
@Entity()
export class Category {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ length: 150 })
  categoryTitle: string;

  @Field({ nullable: true })
  @Column({ length: 200 })
  categoryDescription: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Section, { nullable: true })
  @ManyToOne(() => Section, (section) => section.id)
  section: Section;

  @Field(() => Int)
  @Column()
  sectionId: number;

  @Field(() => [Thread], { nullable: true })
  @OneToMany(() => Thread, (thread) => thread.category)
  threads: Thread[];
}
