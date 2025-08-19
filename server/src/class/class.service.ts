import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Class } from '../schema/class.schema';
import { School } from 'src/schema/school.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name)
    private classModel: Model<Class>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async create(req: Request, createClassDto: CreateClassDto): Promise<Class> {
    try {
      const school = await this.schoolModel.findOne({
        _id: createClassDto.schoolId,
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      const user = await this.userModel.findOne({
        _id: createClassDto.createdBy,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      createClassDto.createdBy = req['user'].id;
      const newClass = await this.classModel.create(createClassDto);
      return newClass;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Class[]> {
    return this.classModel.find().populate(['school', 'classTeacher']);
  }

  async findBySchool(schoolId: string): Promise<Class[]> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new NotFoundException('School not found');
    }
    return this.classModel
      .find({ school: schoolId })
      .populate(['school', 'classTeacher']);
  }

  async findOne(id: string): Promise<Class> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Class not found');
    }
    const classData = await this.classModel
      .findById(id)
      .populate(['school', 'classTeacher']);
    if (!classData) {
      throw new NotFoundException('Class not found');
    }
    return classData;
  }

  async update(id: string, updateClassDto: any): Promise<Class> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Class not found');
    }
    const updatedClass = await this.classModel
      .findByIdAndUpdate(id, updateClassDto, { new: true })
      .populate(['school', 'classTeacher']);
    if (!updatedClass) {
      throw new NotFoundException('Class not found');
    }
    return updatedClass;
  }

  async remove(id: string): Promise<Class> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Class not found');
    }
    const deletedClass = await this.classModel.findByIdAndDelete(id);
    if (!deletedClass) {
      throw new NotFoundException('Class not found');
    }
    return deletedClass;
  }
}
