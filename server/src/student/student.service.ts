import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Divisions, Gender, Student } from '../schema/student.schema';
import { StudentResponseDto } from './dto/student-response.dto';
import { School } from 'src/schema/school.schema';
import { Readable } from 'stream';
import csv from 'csv-parser';
export interface PaginationMeta {
  total: number; // total number of students
  page: number; // current page
  limit: number; // records per page
  totalPages: number; // calculated total pages
}

export interface StudentArrayResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination: PaginationMeta; // new field for pagination
}
@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
  ) {}

  async create(createStudentDto: any): Promise<StudentResponseDto> {
    try {
      const school = await this.schoolModel.findById({
        _id: createStudentDto.schoolId,
      });
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
      throw new BadRequestException(
        'Something went wrong creating new student',
      );
    }
  }

  async processCSVFile(file: Express.Multer.File, schoolId: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const school = await this.schoolModel.findById(schoolId);
    if (!school) {
      throw new NotFoundException('School not found');
    }

    const results: any[] = [];
    const errors: any[] = [];
    const savePromises: Promise<any>[] = [];

    return new Promise((resolve, reject) => {
      try {
        const stream = Readable.from(file.buffer.toString());

        stream
          .pipe(csv())
          .on('data', (row) => {
            try {
              if (
                !row.firstName ||
                !row.lastName ||
                !row.dateOfBirth ||
                !row.gender ||
                !row.rollNumber ||
                !row.fatherName ||
                !row.motherName ||
                !row.grade ||
                !row.contactNumber ||
                !row.address
              ) {
                errors.push({ row, error: 'Missing required fields' });
                return;
              }

              const student = new this.studentModel({
                firstName: row.firstName,
                middleName: row.middleName || null,
                lastName: row.lastName,
                dateOfBirth: new Date(row.dateOfBirth),
                gender: row.gender.toLowerCase() as Gender,
                rollNumber: row.rollNumber,
                fatherName: row.fatherName,
                motherName: row.motherName,
                schoolId: schoolId,
                grade: Number(row.grade),
                division: (row.division || Divisions.A) as Divisions,
                contactNumber: row.contactNumber,
                address: row.address,
              });

              savePromises.push(
                student
                  .save()
                  .then((saved) => results.push(saved))
                  .catch((err) => errors.push({ row, error: err.message })),
              );
            } catch (err) {
              errors.push({ row, error: err.message });
            }
          })
          .on('end', async () => {
            try {
              await Promise.all(savePromises);
              resolve({
                message: 'CSV processed',
                saved: results.length,
                failed: errors.length,
                errors,
              });
            } catch (err) {
              reject(new InternalServerErrorException(err.message));
            }
          })
          .on('error', (err) => {
            reject(
              new InternalServerErrorException(
                `CSV parsing failed: ${err.message}`,
              ),
            );
          });
      } catch (err) {
        reject(
          new InternalServerErrorException(`Unexpected error: ${err.message}`),
        );
      }
    });
  }

  async findAll(page = 1, limit = 10): Promise<StudentArrayResponse> {
    try {
      // Convert page & limit into numbers and prevent invalid values
      const pageNumber = Math.max(1, Number(page));
      const pageSize = Math.max(1, Number(limit));

      const skip = (pageNumber - 1) * pageSize;

      // Fetch students with pagination
      const students = await this.studentModel
        .find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      const total = await this.studentModel.countDocuments();

      if (!students || students.length === 0) {
        throw new NotFoundException('Students not found');
      }

      return {
        success: true,
        message: 'Students found successfully',
        pagination: {
          total, // total number of students
          page: pageNumber, // current page
          limit: pageSize, // records per page
          totalPages: Math.ceil(total / pageSize),
        },
        data: students,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
    }
  }

  async findBySchool(
    schoolId: string,
    page = 1,
    limit = 10,
  ): Promise<StudentArrayResponse> {
    try {
      const skip = (page - 1) * limit;

      const [students, total] = await Promise.all([
        this.studentModel.find({ schoolId }).skip(skip).limit(limit),
        this.studentModel.countDocuments({ schoolId }),
      ]);

      if (!students || students.length === 0) {
        throw new NotFoundException('Students not found');
      }

      return {
        success: true,
        message: 'Students found successfully',
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        data: students,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Something went wrong');
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
      throw new BadRequestException(error.message || 'Something went wrong');
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
      throw new BadRequestException(error.message || 'Something went wrong');
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

  async removeAll(schoolId: string): Promise<any> {
    console.log('deleting all student');
    const school = await this.schoolModel.findById({ _id: schoolId });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    const students = await this.studentModel.deleteMany({ schoolId });
    return students;
  }
}
