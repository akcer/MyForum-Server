import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionResolver } from './section.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  providers: [SectionResolver, SectionService],
})
export class SectionModule {}
