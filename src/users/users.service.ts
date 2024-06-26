import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../schemas/user.schema';
import { UserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(UserDto: UserDto): Promise<User> {
    const createdUser = new this.userModel(UserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('roles').exec();
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username }).populate('roles').exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('roles').exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, UserDto: UserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, UserDto, { new: true })
      .populate('roles')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }
}
