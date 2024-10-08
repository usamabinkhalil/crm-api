import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Role } from '../../schemas/role.schema';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { PermissionsService } from 'src/modules/permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionsService: PermissionsService,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissions } = createRoleDto;
    const role = new this.roleModel({ name, permissions });
    return role.save();
  }

  async getRolePermissions(
    id: ObjectId,
  ): Promise<{ [controller: string]: string[] }> {
    const role = await this.roleModel.findById(id);
    return role?.permissions || {};
  }

  async getRoles(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = await this.roleModel.countDocuments(query);
    const users = await this.roleModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      total,
      page,
      limit,
      data: users,
    };
  }

  async getRoleById(id: string): Promise<Role> {
    return this.roleModel.findById(id).exec();
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();
  }

  async deleteRole(id: string): Promise<Role> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }

  // async addPermissionToRole(
  //   roleName: string,
  //   permissionName: string,
  // ): Promise<Role> {
  //   const permissions = this.permissionsService.getAllPermissions();
  //   const permission = indexOf(permissions, permissionName);
  //   if (permission < 0) {
  //     throw new Error('Permission not found');
  //   }
  //   const role = await this.roleModel.findOne({ name: roleName });
  //   if (!role) {
  //     throw new Error('Role not found');
  //   }
  //   role.permissions.push(permissionName);
  //   return role.save();
  // }
}
