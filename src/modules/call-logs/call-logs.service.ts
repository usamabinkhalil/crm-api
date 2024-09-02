import { Injectable, NotFoundException } from '@nestjs/common';
import { CallLogDto } from './dto/call-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CallLog } from 'src/schemas/call-log.schema';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectModel(CallLog.name) private readonly callLogModel: Model<CallLog>,
  ) {}

  async create(callLog: CallLogDto) {
    const newCallLog = new this.callLogModel(callLog);
    return newCallLog.save();
  }

  async findAll(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = await this.callLogModel.countDocuments(query);
    const assistants = await this.callLogModel
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
    const callLog = await this.callLogModel.findOne(query).exec();
    if (!callLog) {
      throw new NotFoundException('Logs not found');
    }
    return callLog;
  }

  async update(id: string, callLog: CallLogDto) {
    const existingCallLog = await this.callLogModel
      .findByIdAndUpdate(id, callLog, { new: true })
      .exec();
    if (!existingCallLog) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return existingCallLog;
  }

  async remove(id: number) {
    const deletedCallLog = await this.callLogModel.findByIdAndDelete(id).exec();
    if (!deletedCallLog) {
      throw new NotFoundException(`Logs with ID "${id}" not found`);
    }
    return deletedCallLog;
  }
}
