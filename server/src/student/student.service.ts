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
    const student = await this.studentModel.create(createStudentDto);
    return student;
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().populate(['school', 'class']);
  }

  async findBySchool(schoolId: string): Promise<Student[]> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new NotFoundException('School not found');
    }
    return this.studentModel
      .find({ school: schoolId })
      .populate(['school', 'class']);
  }

  async findByClass(classId: string): Promise<Student[]> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new NotFoundException('Class not found');
    }
    return this.studentModel
      .find({ class: classId })
      .populate(['school', 'class']);
  }

  async findOne(id: string): Promise<Student> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    const student = await this.studentModel
      .findById(id)
      .populate(['school', 'class']);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: any): Promise<Student> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }
    const student = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .populate(['school', 'class']);
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
