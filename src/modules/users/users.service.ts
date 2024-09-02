import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async getUsers(query: any, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments(query);
    const users = await this.userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('roles')
      .exec();

    return {
      total,
      page,
      limit,
      data: users,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return existingUser;
  }

  async findOne(query: any): Promise<User> {
    const user = await this.userModel.findOne(query).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(query: any): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return deletedUser;
  }
}
