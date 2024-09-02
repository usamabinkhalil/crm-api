import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CallLogsService } from './call-logs.service';
import { CallLogDto } from './dto/call-log.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { Permissions } from '../permissions/permissions.decorator';

@Controller('call-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CallLogsController {
  constructor(private readonly callLogsService: CallLogsService) {}

  @Permissions('read:call-logs')
  @Get()
  findAll(@Body() body: any) {
    const { page = 1, limit = 10, ...query } = body;
    return this.callLogsService.findAll(query, page, limit);
  }

  @Permissions('read:call-log')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callLogsService.findOne(+id);
  }

  @Permissions('update:call-log')
  @Patch(':id')
  update(@Param('id') id: string, @Body() callLog: CallLogDto) {
    return this.callLogsService.update(id, callLog);
  }

  @Permissions('delete:call-log')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callLogsService.remove(+id);
  }
}
