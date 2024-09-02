import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { BodyAssistantDto } from './dto/assistant.dto';
import { Permissions } from '../permissions/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { TwilioService } from '../twilio/twilio.service';
import { ConfigService } from '@nestjs/config';

@Controller('assistant')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly twilioService: TwilioService,
    private configService: ConfigService,
  ) {}

  @Permissions('create:assistant')
  @Post()
  create(@Body() assistantDto: BodyAssistantDto, @Req() req: any) {
    const user = req.user;
    const createdBy: ObjectId = ObjectId.createFromHexString(user.id);
    return this.assistantService.create({ ...assistantDto, createdBy });
  }

  @Permissions('read:assistants')
  @Post('all')
  findAll(@Body() body: any) {
    const { page = 1, limit = 10, ...query } = body;
    return this.assistantService.findAll(query, page, limit);
  }

  @Permissions('read:assistant')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistantService.findOne({ _id: id });
  }

  @Permissions('update:assistant')
  @Patch(':id')
  update(@Param('id') id: string, @Body() assistantDto: BodyAssistantDto) {
    return this.assistantService.update(id, assistantDto);
  }

  @Permissions('delete:assistant')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistantService.remove(id);
  }

  @Permissions('read:assistant')
  @Get('verify-number/:id')
  async verifyNumber(@Param('id') id: string) {
    const assistant: any = await this.assistantService.findOne({ _id: id });
    const { voiceUrl, voiceFallbackUrl, statusCallback } =
      await this.twilioService.updateVoiceUrl(assistant.number, id);
    assistant.isValidNumber = true;
    assistant.voiceUrl = voiceUrl;
    assistant.voiceFallbackUrl = voiceFallbackUrl;
    assistant.statusCallback = statusCallback;
    return this.assistantService.update(id, assistant);
  }
}
