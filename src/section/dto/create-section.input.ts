import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSectionInput {
  @Field()
  section?: string;
}
