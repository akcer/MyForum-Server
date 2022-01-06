import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @Field({ nullable: true })
  categoryTitle?: string;

  @Field({ nullable: true })
  categoryDescription?: string;

  @Field({ nullable: true })
  sectionId?: number;
}
