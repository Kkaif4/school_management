import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../schema/user.schema';
import { UserAlreadyExistsException } from 'src/exceptions/already-exists.exception';
import { Roles } from 'src/decorator/roles.decorator';
import { School } from 'src/schema/school.schema';
import { UserResponseDto } from './dto/user-response.dto';

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    id: Types.ObjectId;
    role: string;
    schoolId: Types.ObjectId;
    isActive: boolean;
  };
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    const school = await this.schoolModel.findById(createUserDto.schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    if (existingUser) {
      throw new UserAlreadyExistsException('email', 'Email already exists');
    }
    createUserDto.role = UserRole.TEACHER;
    const user = await this.userModel.create(createUserDto);
    const response = {
      success: true,
      message: 'User created successfully',
      data: {
        id: user._id,
        role: user.role,
        schoolId: user.schoolId,
        isActive: user.isActive,
      },
    };
    return response;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const response = {
      success: true,
      message: 'User found successfully',
      data: user,
    };
    return response;
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async remove(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
