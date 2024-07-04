import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../schemas/role.schema';
import { Permission } from '../schemas/permission.schema';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permissions } = createRoleDto;
    const role = new this.roleModel({ name, permissions });
    return role.save();
  }

  async getRolePermissions(roleName: string): Promise<Permission[]> {
    const role = await this.roleModel
      .findOne({ name: roleName })
      .populate('permissions');
    return role.permissions;
  }

  async getRoles(): Promise<Role[]> {
    return this.roleModel.find().populate('permissions').exec();
  }

  async getRoleById(id: string): Promise<Role> {
    return this.roleModel.findById(id).populate('permissions').exec();
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .exec();
  }

  async deleteRole(id: string): Promise<Role> {
    return this.roleModel.findByIdAndDelete(id).exec();
  }

  async addPermissionToRole(
    roleName: string,
    permissionName: string,
  ): Promise<Role> {
    const permission = await this.permissionModel.findOne({
      name: permissionName,
    });
    if (!permission) {
      throw new Error('Permission not found');
    }

    const role = await this.roleModel.findOne({ name: roleName });
    if (!role) {
      throw new Error('Role not found');
    }

    role.permissions.push(permission);
    return role.save();
  }
}
