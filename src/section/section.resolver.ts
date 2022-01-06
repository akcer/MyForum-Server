import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SectionService } from './section.service';
import { Section } from './entities/section.entity';
import { CreateSectionInput } from './dto/create-section.input';
import { UpdateSectionInput } from './dto/update-section.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-auth-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Section)
export class SectionResolver {
  constructor(private readonly sectionService: SectionService) {}

  @Mutation(() => Section)
  @UseGuards(GqlAuthGuard)
  createSection(
    @Args('createSectionInput') createSectionInput: CreateSectionInput,
    @CurrentUser() user: User,
  ) {
    return this.sectionService.create(createSectionInput, user);
  }

  @Query(() => [Section], { name: 'sections' })
  findAll() {
    return this.sectionService.findAll();
  }

  @Query(() => Section, { name: 'section' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sectionService.findOne(id);
  }

  @Mutation(() => Section)
  @UseGuards(GqlAuthGuard)
  updateSection(
    @Args('updateSectionInput') updateSectionInput: UpdateSectionInput,
    @CurrentUser() user: User,
  ) {
    return this.sectionService.update(
      updateSectionInput.id,
      updateSectionInput,
      user,
    );
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  removeSection(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: User,
  ) {
    return this.sectionService.remove(id, user);
  }
}
