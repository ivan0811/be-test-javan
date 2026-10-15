import { Test, TestingModule } from '@nestjs/testing';
import { NationalizeController } from './nationalize.controller.js';
import { NationalizeService } from './nationalize.service.js';

describe('NationalizeController', () => {
  let controller: NationalizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NationalizeController],
      providers: [
        {
          provide: NationalizeService,
          useValue: { getAll: vi.fn() },
        },
      ],
    }).compile();

    controller = module.get<NationalizeController>(NationalizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
