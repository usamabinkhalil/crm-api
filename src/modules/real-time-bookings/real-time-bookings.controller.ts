import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { RealTimeBookingsService } from './real-time-bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Permissions } from '../permissions/permissions.decorator';
import { ObjectId } from 'mongodb';

@Controller('real-time-bookings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class RealTimeBookingsController {
  constructor(
    private readonly realTimeBookingsService: RealTimeBookingsService,
  ) {}

  @Permissions('create:real-time-booking')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    const user = req.user;
    const createdBy: ObjectId = ObjectId.createFromHexString(user.id);
    const assistantId: ObjectId = ObjectId.createFromHexString(
      body.assistantId,
    );
    return this.realTimeBookingsService.create({
      ...body,
      createdBy,
      assistantId,
    });
  }

  @Permissions('read:real-time-bookings')
  @Post('all')
  findAll(@Body() body: any) {
    const { page = 1, limit = 10, ...query } = body;
    return this.realTimeBookingsService.findAll(query, page, limit);
  }

  @Permissions('update:real-time-booking')
  @Get('timezones')
  getTimezones() {
    return this.realTimeBookingsService.getTimezones();
  }

  @Permissions('update:real-time-booking')
  @Get('event-types/:id')
  async getEventTypes(@Param('id') id: string) {
    const realTimeBookings = await this.realTimeBookingsService.findOne({
      $or: [
        { _id: ObjectId.createFromHexString(id) },
        { assistantId: ObjectId.createFromHexString(id) },
      ],
    });
    return this.realTimeBookingsService.getEventTypes(realTimeBookings.apiKey);
  }

  @Permissions('read:real-time-booking')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.realTimeBookingsService.findOne({
      $or: [
        { _id: ObjectId.createFromHexString(id) },
        { assistantId: ObjectId.createFromHexString(id) },
      ],
    });
  }

  @Permissions('update:real-time-booking')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const createdBy: ObjectId = ObjectId.createFromHexString(body.createdBy);
    const assistantId: ObjectId = ObjectId.createFromHexString(
      body.assistantId,
    );
    return this.realTimeBookingsService.update(id, {
      ...body,
      createdBy,
      assistantId,
    });
  }

  @Permissions('delete:real-time-booking')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.realTimeBookingsService.remove(id);
  }
}
