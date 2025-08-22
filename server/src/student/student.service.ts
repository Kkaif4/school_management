import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../schema/student.schema';
import { StudentResponseDto } from './dto/student-response.dto';

export interface StudentArrayResponse {
  success: boolean;
  message: string;
  data: Student[];
}

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: any): Promise<StudentResponseDto> {
    try {
      const school = await this.studentModel.findOne(createStudentDto.schoolId);
      if (!school) {
        throw new NotFoundException('School not found');
      }

      const student = await this.studentModel.create(createStudentDto);
      const response = {
        success: true,
        message: 'Student created successfully',
        data: student,
      };
      return response;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }

  async findAll(): Promise<StudentArrayResponse> {
    const students = await this.studentModel.find();
    if (!students || students.length === 0) {
      throw new NotFoundException('Students not found');
    }
    const response = {
      success: true,
      message: 'Students found successfully',
      data: students,
    };
    return response;
  }

  async findBySchool(schoolId: string): Promise<StudentArrayResponse> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new NotFoundException('School not found');
    }

    try {
      const students = await this.studentModel.find({ school: schoolId });

      if (!students || students.length === 0) {
        throw new NotFoundException('Students not found');
      }

      const response = {
        success: true,
        message: 'Students found successfully',
        data: students,
      };
      return response;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOne(id: string): Promise<StudentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    try {
      const student = await this.studentModel.findById(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const response = {
        success: true,
        message: 'Student found successfully',
        data: student,
      };

      return response;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(id: string, updateStudentDto: any): Promise<StudentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    try {
      const student = await this.studentModel.findByIdAndUpdate(
        id,
        updateStudentDto,
        { new: true },
      );
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const response = {
        success: true,
        message: 'Student updated successfully',
        data: student,
      };
      return response;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(id: string): Promise<Student> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    const student = await this.studentModel.findByIdAndDelete(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }
}
