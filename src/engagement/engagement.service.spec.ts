import { Test, TestingModule } from '@nestjs/testing';
import { EngagementService } from './engagement.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Engagement } from '../db/entities/Engagement.entity';
import { Save } from '../db/entities/Save.entity';
import { Clickout } from '../db/entities/Clickout.entity';
import { MoreThan } from 'typeorm';

describe('EngagementService', () => {
  let service: EngagementService;
  let clickoutRepository: any;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EngagementService,
        {
          provide: getRepositoryToken(Engagement),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(Save),
          useValue: { ...mockRepository },
        },
        {
          provide: getRepositoryToken(Clickout),
          useValue: { ...mockRepository },
        },
      ],
    }).compile();

    service = module.get<EngagementService>(EngagementService);
    clickoutRepository = module.get(getRepositoryToken(Clickout));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackClick', () => {
    it('should deduplicate clicks within 5 minutes', async () => {
      const userId = 'user-1';
      const clickDto = { product_id: 'prod-1' };
      
      clickoutRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      const result = await service.trackClick(userId, clickDto as any);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Click already tracked (deduplicated)');
      expect(clickoutRepository.save).not.toHaveBeenCalled();
      expect(clickoutRepository.findOne).toHaveBeenCalledWith({
        where: {
          productId: 'prod-1',
          userId: 'user-1',
          createdAt: expect.anything(),
        },
      });
    });

    it('should create new click if no existing click within 5 minutes', async () => {
      const userId = 'user-1';
      const clickDto = { 
        product_id: 'prod-1',
        trend_id: 'trend-1',
        source_type: 'ORGANIC_FEED'
      };
      
      clickoutRepository.findOne.mockResolvedValue(null);
      clickoutRepository.create.mockReturnValue(clickDto);
      clickoutRepository.save.mockResolvedValue({ id: 'new-id', ...clickDto });

      const result = await service.trackClick(userId, clickDto as any, 'ip-hash-1');

      expect(result.success).toBe(true);
      expect(clickoutRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        productId: 'prod-1',
        trendId: 'trend-1',
        ipHash: 'ip-hash-1',
      }));
      expect(clickoutRepository.save).toHaveBeenCalled();
    });

    it('should deduplicate anonymous clicks by IP hash', async () => {
      const clickDto = { product_id: 'prod-1' };
      const ipHash = 'ip-hash-1';
      
      clickoutRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      const result = await service.trackClick(null, clickDto as any, ipHash);

      expect(result.success).toBe(true);
      expect(clickoutRepository.findOne).toHaveBeenCalledWith({
        where: {
          productId: 'prod-1',
          ipHash: 'ip-hash-1',
          createdAt: expect.anything(),
        },
      });
    });
  });
});
