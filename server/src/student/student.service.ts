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
import { CreateStudentDto } from './dto/create-student.dto';
import { isEmpty } from 'class-validator';
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StudentArrayResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination: PaginationMeta;
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingStudent?: Student;
  message?: string;
}

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
  ) {}

  private async checkDuplicateStudent(
    schoolId: string,
    grade: string | number,
    rollNumber: string | number,
    excludeStudentId?: string,
  ): Promise<DuplicateCheckResult> {
    try {
      const query = {
        schoolId,
        grade: grade.toString(),
        rollNumber: rollNumber.toString(),
      };

      if (excludeStudentId) {
        Object.assign(query, { _id: { $ne: excludeStudentId } });
      }

      const existingStudent = await this.studentModel.findOne(query).lean();

      if (existingStudent) {
        return {
          isDuplicate: true,
          existingStudent,
          message: `A student with roll number ${rollNumber} already exists in grade ${grade}`,
        };
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error('Error checking duplicate student:', error);
      throw new InternalServerErrorException(
        'Failed to check for duplicate student',
      );
    }
  }

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    try {
      const school = await this.schoolModel.findById({
        _id: createStudentDto.schoolId,
      });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      const duplicateCheck = await this.checkDuplicateStudent(
        createStudentDto.schoolId,
        createStudentDto.grade,
        createStudentDto.rollNumber,
      );
      if (duplicateCheck.isDuplicate) {
        throw new BadRequestException(duplicateCheck.message);
      }
      const student = await this.studentModel.create(createStudentDto);
      school.totalStudents += 1;
      await school.save();
      return {
        success: true,
        message: 'Student created successfully',
        data: student,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message ||
          'Something went wrong while creating new student. Please try again.',
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

    return new Promise<{
      success: boolean;
      message: string;
      summary: {
        total: number;
        saved: number;
        failed: number;
        duplicates: number;
        validationFailed: number;
        missingFields: number;
      };
      errors: {
        duplicates: any[];
        validation: any[];
        missingFields: any[];
      };
    }>((resolve, reject) => {
      const stream = Readable.from(file.buffer).pipe(csv());

      stream.on('data', (row) => {
        const task = (async () => {
          try {
            if (
              !row.studentId ||
              !row.registerNumber ||
              !row.firstName ||
              !row.lastName ||
              !row.dateOfBirth ||
              !row.birthPlace ||
              !row.gender ||
              !row.rollNumber ||
              !row.fatherName ||
              !row.motherName ||
              !row.adhaar ||
              !row.cast ||
              !row.religion ||
              !row.nationality ||
              !row.grade ||
              !row.division ||
              !row.contactNumber ||
              !row.address ||
              !row.admissionDate
            ) {
              errors.push({ row, error: 'Missing required fields' });
              return;
            }

            // Duplicate check
            const duplicateCheck = await this.checkDuplicateStudent(
              schoolId,
              row.grade,
              row.rollNumber,
            );

            if (duplicateCheck.isDuplicate) {
              errors.push({
                row,
                error: `Duplicate entry: ${duplicateCheck.message}`,
                type: 'DUPLICATE',
              });
              return;
            }

            // Build student object
            const studentData = {
              studentId: row.studentId,
              registerNumber: row.registerNumber,
              firstName: row.firstName,
              middleName: row.middleName || null,
              lastName: row.lastName,
              dateOfBirth: new Date(row.dateOfBirth).toISOString(),
              birthPlace: row.birthPlace,
              gender: row.gender.toLowerCase() as Gender,
              rollNumber: Number(row.rollNumber),
              fatherName: row.fatherName,
              motherName: row.motherName,
              adhaar: row.adhaar,
              cast: row.cast,
              religion: row.religion,
              nationality: row.nationality,
              grade: Number(row.grade),
              division: (row.division || Divisions.A) as Divisions,
              contactNumber: row.contactNumber,
              address: row.address,
              previousSchoolName: row.previousSchoolName || null,
              admissionDate: new Date(row.admissionDate).toISOString(),
              customFields: !isEmpty(row.customFields)
                ? JSON.parse(row.customFields)
                : [],
              schoolId,
            };

            const student = new this.studentModel(studentData);

            await student.save().then((saved) => results.push(saved));
            school.totalStudents += results.length;
            await school.save();
          } catch (err) {
            errors.push({
              row,
              error: err.message,
              type: 'VALIDATION',
            });
          }
        })();

        savePromises.push(task);
      });

      stream.on('end', async () => {
        try {
          await Promise.allSettled(savePromises);

          const duplicateErrors = errors.filter((e) => e.type === 'DUPLICATE');
          const validationErrors = errors.filter(
            (e) => e.type === 'VALIDATION',
          );
          const missingFieldErrors = errors.filter((e) => !e.type);

          resolve({
            success: true,
            message: 'CSV processing completed',
            summary: {
              total: results.length + errors.length,
              saved: results.length,
              failed: errors.length,
              duplicates: duplicateErrors.length,
              validationFailed: validationErrors.length,
              missingFields: missingFieldErrors.length,
            },
            errors: {
              duplicates: duplicateErrors,
              validation: validationErrors,
              missingFields: missingFieldErrors,
            },
          });
        } catch (err) {
          reject(new InternalServerErrorException(err.message));
        }
      });

      stream.on('error', (err) => {
        reject(
          new InternalServerErrorException(
            `CSV parsing failed: ${err.message}`,
          ),
        );
      });
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<StudentArrayResponse> {
    try {
      const pageNumber = Math.max(1, Number(page));
      const pageSize = clamp(Number(limit), 1, 100);
      const skip = (pageNumber - 1) * pageSize;

      let query = this.studentModel.find();
      if (search) {
        query = query.or([
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { rollNumber: new RegExp(search, 'i') },
          { grade: new RegExp(search, 'i') },
        ]);
      }
      const [students, total] = await Promise.all([
        query
          .sort({ [sort]: order })
          .skip(skip)
          .limit(pageSize)
          .select('-__v')
          .lean()
          .exec(),
        query.clone().countDocuments(),
      ]);

      if (!students || students.length === 0) {
        throw new NotFoundException('No students found');
      }

      return {
        success: true,
        message: 'Students found successfully',
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
        data: students,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to fetch students. Please try again later.',
      );
    }
  }

  async findBySchool(
    schoolId: string,
    page = 1,
    limit = 20,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<StudentArrayResponse> {
    console.log('schoolId', schoolId);
    try {
      if (!Types.ObjectId.isValid(schoolId)) {
        throw new BadRequestException('Invalid school ID');
      }
      const school = await this.schoolModel.findById({ _id: schoolId });
      if (!school) {
        throw new NotFoundException('School not found');
      }
      const pageNumber = Math.max(1, Number(page));
      const pageSize = clamp(Number(limit), 1, 100);
      const skip = (pageNumber - 1) * pageSize;

      let query = this.studentModel.find({ schoolId });

      if (search) {
        query = query.or([
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { rollNumber: new RegExp(search, 'i') },
          { grade: new RegExp(search, 'i') },
        ]);
      }

      const [students, total] = await Promise.all([
        query
          .sort({ [sort]: order })
          .skip(skip)
          .limit(pageSize)
          .select('-__v')
          .lean()
          .exec(),
        query.clone().countDocuments(),
      ]);

      if (!students || students.length === 0) {
        throw new NotFoundException('No students found for this school');
      }

      return {
        success: true,
        message: 'Students found successfully',
        pagination: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
        data: students,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message ||
          'Failed to fetch school students. Please try again later.',
      );
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
