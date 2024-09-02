import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeBookingsService } from './real-time-bookings.service';

describe('RealTimeBookingsService', () => {
  let service: RealTimeBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealTimeBookingsService],
    }).compile();

    service = module.get<RealTimeBookingsService>(RealTimeBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
