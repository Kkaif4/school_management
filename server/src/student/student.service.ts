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

// Helper function to clamp a number between min and max values
function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>,
    @InjectModel(School.name)
    private schoolModel: Model<School>,
  ) {}

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
      const student = await this.studentModel.create(createStudentDto);
      const response = {
        success: true,
        message: 'Student created successfully',
        data: student,
      };
      return response;
    } catch (error) {
      console.error('Error creating student:', error);
      throw new BadRequestException(
        error.message || 'Something went wrong creating new student',
      );
    }
  }

  async processCSVFile(file: Express.Multer.File, schoolId: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const school = await this.schoolModel.findById(schoolId);
    console.log(school);
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
                isEmpty(row.studentId) ||
                isEmpty(row.registerNumber) ||
                isEmpty(row.firstName) ||
                isEmpty(row.lastName) ||
                isEmpty(row.dateOfBirth) ||
                isEmpty(row.birthPlace) ||
                isEmpty(row.gender) ||
                isEmpty(row.rollNumber) ||
                isEmpty(row.fatherName) ||
                isEmpty(row.motherName) ||
                isEmpty(row.adhaar) ||
                isEmpty(row.cast) ||
                isEmpty(row.religion) ||
                isEmpty(row.nationality) ||
                isEmpty(row.grade) ||
                isEmpty(row.division) ||
                isEmpty(row.contactNumber) ||
                isEmpty(row.address) ||
                isEmpty(row.admissionDate)
              ) {
                errors.push({ row, error: 'Missing required fields' });
                return;
              }

              const student = new this.studentModel({
                studentId: Number(row.studentId),
                registerNumber: Number(row.registerNumber),
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
                schoolId: schoolId,
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

  async findAll(
    page = 1,
    limit = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<StudentArrayResponse> {
    try {
      // Validate and normalize pagination params
      const pageNumber = Math.max(1, Number(page));
      const pageSize = clamp(Number(limit), 1, 100); // Limit max page size to 100
      const skip = (pageNumber - 1) * pageSize;

      // Build query with search if provided
      let query = this.studentModel.find();
      if (search) {
        query = query.or([
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { rollNumber: new RegExp(search, 'i') },
          { grade: new RegExp(search, 'i') },
        ]);
      }

      // Execute query with pagination and sorting in parallel
      const [students, total] = await Promise.all([
        query
          .sort({ [sort]: order })
          .skip(skip)
          .limit(pageSize)
          .select('-__v') // Exclude version field
          .lean() // Convert to plain JS object for better performance
          .exec(),
        query.clone().countDocuments(), // Use clone() to avoid modifying original query
      ]);

      // Return empty response instead of error for no results
      if (!students || students.length === 0) {
        return {
          success: true,
          message: 'No students found',
          pagination: {
            total: 0,
            page: pageNumber,
            limit: pageSize,
            totalPages: 0,
          },
          data: [],
        };
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
    try {
      // Validate school ID
      if (!Types.ObjectId.isValid(schoolId)) {
        throw new BadRequestException('Invalid school ID');
      }

      // Validate and normalize pagination params
      const pageNumber = Math.max(1, Number(page));
      const pageSize = clamp(Number(limit), 1, 100);
      const skip = (pageNumber - 1) * pageSize;

      // Build base query
      let query = this.studentModel.find({ schoolId });

      // Add search if provided
      if (search) {
        query = query.or([
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
          { rollNumber: new RegExp(search, 'i') },
          { grade: new RegExp(search, 'i') },
        ]);
      }

      // Execute query with pagination and sorting in parallel
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

      // Return empty response instead of error for no results
      if (!students || students.length === 0) {
        return {
          success: true,
          message: 'No students found for this school',
          pagination: {
            total: 0,
            page: pageNumber,
            limit: pageSize,
            totalPages: 0,
          },
          data: [],
        };
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
      console.error('Error in findBySchool:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
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
