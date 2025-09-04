import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { School } from '../schema/school.schema';
import { SchoolResponseDto } from './dto/school-response.dto';
import { User } from 'src/schema/user.schema';
import { SchoolAlreadyExistsException } from 'src/exceptions/already-exists.exception';

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
  ) {}

  async create(
    req: Request,
    createSchoolDto: CreateSchoolDto,
  ): Promise<SchoolResponseDto> {
    try {
      const admin = await this.userModel.findOne({
        _id: createSchoolDto.adminId,
      });

      if (!admin) {
        throw new NotFoundException('Admin user not found');
      }
      const existingSchool = await this.schoolModel.findOne({
        $and: [
          { name: createSchoolDto.name },
          { adminId: createSchoolDto.adminId },
        ],
      });

      if (existingSchool) {
        throw new SchoolAlreadyExistsException(createSchoolDto.name);
      }
      const school = await new this.schoolModel(createSchoolDto).save();
      const response = {
        success: true,
        message: 'School created successfully',
        data: school,
      };
      return response;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('School name already exists');
      }
      throw error;
    }
  }

  async findAllByUser(req: Request): Promise<SchoolsArray> {
    const userId = req['user'].id.toString();
    try {
      const schools = await this.schoolModel.find({ adminId: userId });
      if (!schools || schools.length === 0) {
        throw new NotFoundException('School not found');
      }
      const response = {
        success: true,
        message: 'Schools found successfully',
        data: schools,
      };
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Could not fetch schools');
    }
  }

  async findOne(id: string): Promise<SchoolResponseDto> {
    const school = await this.schoolModel.findById(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    const response = {
      success: true,
      message: 'School found successfully',
      data: school,
    };
    return response;
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
    const response = {
      success: true,
      message: 'School updated successfully',
      data: school,
    };

    return response;
  }

  async remove(id: string): Promise<School> {
    const school = await this.schoolModel.findByIdAndDelete(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }
}
