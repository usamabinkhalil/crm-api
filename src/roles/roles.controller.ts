import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Permissions } from 'src/auth/permissions.decorator';

@ApiTags('roles')
@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Permissions('create:role')
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Permissions('read:roles')
  @Get()
  async findAll() {
    return this.rolesService.getRoles();
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, description: 'Return the role.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'The ID of the role' })
  @Permissions('read:role')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.getRoleById(id);
  }

  @ApiOperation({ summary: 'Update a role by id' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'The ID of the role' })
  @Permissions('update:role')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete a role by id' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'The ID of the role' })
  @Permissions('delete:role')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }

  @ApiOperation({ summary: 'Add a permission to a role' })
  @ApiResponse({
    status: 200,
    description: 'The permission has been successfully added.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'id', description: 'The ID of the role' })
  @ApiBody({ schema: { example: { permission: 'read' } } })
  @Permissions('update:role')
  @Post(':id/permissions')
  async addPermission(
    @Param('id') id: string,
    @Body('permission') permission: string,
  ) {
    return this.rolesService.addPermissionToRole(id, permission);
  }
}
