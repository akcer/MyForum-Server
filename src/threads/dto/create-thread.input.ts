import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateThreadInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  threadTitle?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  threadDescription?: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  categoryId?: number;
}
