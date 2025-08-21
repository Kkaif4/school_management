import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../schema/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
  ) {}

  async create(createStudentDto: any): Promise<Student> {
    try {
      const school = await this.studentModel.findOne(createStudentDto.schoolId);
      if (!school) {
        throw new NotFoundException('School not found');
      }

      const student = await this.studentModel.create(createStudentDto);

      return student;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find();
  }

  async findBySchool(schoolId: string): Promise<Student[]> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new NotFoundException('School not found');
    }
    return this.studentModel.find({ school: schoolId });
  }

  async findOne(id: string): Promise<Student> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: any): Promise<Student> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    const student = await this.studentModel.findByIdAndUpdate(
      id,
      updateStudentDto,
      { new: true },
    );
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
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
