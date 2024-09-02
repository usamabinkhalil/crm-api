import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeBookingsController } from './real-time-bookings.controller';
import { RealTimeBookingsService } from './real-time-bookings.service';

describe('RealTimeBookingsController', () => {
  let controller: RealTimeBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealTimeBookingsController],
      providers: [RealTimeBookingsService],
    }).compile();

    controller = module.get<RealTimeBookingsController>(RealTimeBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
