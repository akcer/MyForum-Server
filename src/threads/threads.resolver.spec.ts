import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsResolver } from './threads.resolver';
import { ThreadsService } from './threads.service';

describe('ThreadsResolver', () => {
  let resolver: ThreadsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreadsResolver, ThreadsService],
    }).compile();

    resolver = module.get<ThreadsResolver>(ThreadsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
