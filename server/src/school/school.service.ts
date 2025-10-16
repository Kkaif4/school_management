import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { School } from '../schema/school.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { SchoolAlreadyExistsException } from 'src/exceptions/already-exists.exception';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { AuthUser } from 'src/common/interfaces/user.interface';
import { PaginatedData } from 'src/user/dto/user-response.dto';
import { PaginationUtil } from 'src/utils/pagination.utils';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

export interface SchoolsArray {
  success: boolean;
  message: string;
  data: School[];
}

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private schoolModel: Model<School>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly transformService: ResponseTransformService,
  ) {}

  async create(
    req: Request,
    createSchoolDto: CreateSchoolDto,
  ): Promise<SchoolResponseDto> {
    const adminId = req['user'].id.toString();
    const admin = await this.userModel.findOne({
      _id: adminId,
    });

    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    const existingSchool = await this.schoolModel.findOne({
      $and: [
        { name: createSchoolDto.name },
        { name: createSchoolDto.name.toLowerCase() },
        { adminId: adminId },
      ],
    });

    if (existingSchool) {
      throw new SchoolAlreadyExistsException(createSchoolDto.name);
    }
    const schoolData = { ...createSchoolDto, adminId };
    const school = await this.schoolModel.create(schoolData);
    return this.findOne(school._id.toString());
  }

  async findAllByUser(
    user: AuthUser,
    query: PaginationQueryDto,
  ): Promise<PaginatedData<SchoolResponseDto>> {
    const userId = user.id.toString();
    const { page, limit } = PaginationUtil.validatePaginationParams(
      query.page,
      query.limit,
    );

    const [schools, total] = await Promise.all([
      this.schoolModel.find({ adminId: userId }),
      this.schoolModel.countDocuments({ adminId: userId }),
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
      SchoolResponseDto,
      schools,
      meta,
    );
  }

  async findOne(id: string): Promise<SchoolResponseDto> {
    const school = await this.schoolModel.findById(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return this.transformService.transform(SchoolResponseDto, school);
  }

  async update(
    id: string,
    updateSchoolDto: UpdateSchoolDto,
  ): Promise<SchoolResponseDto> {
    const school = await this.schoolModel.findByIdAndUpdate(
      id,
      updateSchoolDto,
      { new: true },
    );

    if (!school) {
      throw new NotFoundException('School not found');
    }
    return this.findOne(school._id.toString());
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const school = await this.schoolModel.findByIdAndDelete(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return { deleted: true };
  }
}
