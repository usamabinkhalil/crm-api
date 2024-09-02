import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RealTimeBooking } from 'src/schemas/real-time-booking.schema';
import { firstValueFrom } from 'rxjs';
import { filter, isEmpty } from 'lodash';

@Injectable()
export class RealTimeBookingsService {
  private readonly apiUrl = 'https://api.cal.com/v1'; // Base URL for Cal.com v1 API
  private readonly apiUrlV2 = 'https://api.cal.com/v2'; // Base URL for Cal.com v1 API
  constructor(
    @InjectModel(RealTimeBooking.name)
    private realTimeBookingModel: Model<RealTimeBooking>,
    private readonly httpService: HttpService,
  ) {}

  async getTimezones(): Promise<any> {
    const endpoint = `${this.apiUrlV2}/timezones`;
    const response = await firstValueFrom(this.httpService.get(endpoint));
    return filter(response.data?.data, (tz) => !isEmpty(tz.timezone));
  }

  async getCalData(apiKey: string): Promise<any> {
    const endpoint = `${this.apiUrl}/me?apiKey=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(endpoint));
    return response.data;
  }

  async getEventTypes(apiKey: string): Promise<any> {
    const endpoint = `${this.apiUrl}/event-types?apiKey=${apiKey}`;
    const response = await firstValueFrom(this.httpService.get(endpoint));
    return response.data?.event_types;
  }

  async create(data: any) {
    if (data.apiKey) {
      const calData = await this.getCalData(data.apiKey);
      data.userId = calData.user?.id;
      data.username = calData.user?.username;
      data.name = calData.user?.name;
      data.email = calData.user?.email;
    }
    const realTimeBooking = new this.realTimeBookingModel(data);
    return realTimeBooking.save();
  }

  async findAll(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = await this.realTimeBookingModel.countDocuments(query);
    const assistants = await this.realTimeBookingModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      total,
      page,
      limit,
      data: assistants,
    };
  }

  async findOne(query: any) {
    console.log(query);

    const realTimeBooking = await this.realTimeBookingModel
      .findOne(query)
      .exec();
    if (!realTimeBooking) {
      throw new NotFoundException('Not found');
    }
    return realTimeBooking;
  }

  async update(id: string, data: any) {
    const realTimeBooking = await this.realTimeBookingModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!realTimeBooking) {
      throw new NotFoundException(`ID "${id}" not found`);
    }
    return realTimeBooking;
  }

  async remove(id: string) {
    const realTimeBooking = await this.realTimeBookingModel
      .findByIdAndDelete(id)
      .exec();
    if (!realTimeBooking) {
      throw new NotFoundException(`ID "${id}" not found`);
    }
    return realTimeBooking;
  }
}
