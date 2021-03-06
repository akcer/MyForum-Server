import { Test, TestingModule } from '@nestjs/testing';
import { SectionResolver } from './section.resolver';
import { SectionService } from './section.service';

describe('SectionResolver', () => {
  let resolver: SectionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionResolver, SectionService],
    }).compile();

    resolver = module.get<SectionResolver>(SectionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
