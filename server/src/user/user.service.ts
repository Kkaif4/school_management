import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../schema/user.schema';
import { UserAlreadyExistsException } from 'src/exceptions/already-exists.exception';
import { Roles } from 'src/common/decorators/roles.decorator';
import { School } from 'src/schema/school.schema';
import { PaginatedData, UserResponseDto } from './dto/user-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseTransformService } from 'src/services/responseTransformer.service';
import { PaginationUtil } from 'src/utils/pagination.utils';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
    private readonly transformService: ResponseTransformService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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
    school.totalTeachers += 1;
    await school.save();
    return this.findOne(user._id.toString());
  }

  async findMe(userId: string): Promise<UserResponseDto> {
    return this.findOne(userId);
  }

  async findAllTeachers(
    query: PaginationQueryDto,
    schoolId: string,
  ): Promise<PaginatedData<UserResponseDto>> {
    const { page, limit } = PaginationUtil.validatePaginationParams(
      query.page,
      query.limit,
    );
    const [teachers, total] = await Promise.all([
      this.userModel.find({
        schoolId,
        $or: [{ role: UserRole.TEACHER }, { role: UserRole.SUB_ADMIN }],
      }),
      this.userModel.countDocuments({
        schoolId,
        $or: [{ role: UserRole.TEACHER }, { role: UserRole.SUB_ADMIN }],
      }),
    ]);

    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };

    return this.transformService.transformPaginatedResponse(
      UserResponseDto,
      teachers,
      meta,
    );
  }

  async findSchoolTeachers(
    query: PaginationQueryDto,
    schoolId: string,
  ): Promise<PaginatedData<UserResponseDto>> {
    const { page, limit } = PaginationUtil.validatePaginationParams(
      query.page,
      query.limit,
    );
    const [teachers, total] = await Promise.all([
      this.userModel.find({
        schoolId,
        role: UserRole.TEACHER,
      }),
      this.userModel.countDocuments({
        schoolId,
        role: UserRole.TEACHER,
      }),
    ]);

    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
    return this.transformService.transformPaginatedResponse(
      UserResponseDto,
      teachers,
      meta,
    );
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid id');
    }
    const user = await this.userModel.findById({ _id: id }).lean().exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transformService.transform(UserResponseDto, user);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.findOne(user._id.toString());
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async remove(id: string): Promise<{ deleted: boolean }> {
    const user = await this.userModel.findByIdAndDelete(id);
    const school = await this.schoolModel.findById({ _id: user?.schoolId });
    if (school) {
      school.totalTeachers -= 1;
      await school.save();
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { deleted: true };
  }
}
