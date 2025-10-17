import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import csv from 'csv-parser';
import { School } from 'src/schema/school.schema';
import { Divisions, Student } from '../schema/student.schema';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CSVError,
  StudentResponseDto,
  CSVProcessingResult,
} from './dto/student-response.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { Log } from 'src/schema/log.schema';
import { ResponseTransformService } from 'src/services/responseTransformer.service';
import { LogService } from 'src/log/log.service';
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
    @InjectModel(Log.name)
    private logModel: Model<Log>,
    private readonly transformService: ResponseTransformService,
    private readonly logService: LogService,
  ) {}

  private async checkDuplicateStudent(
    schoolId: string,
    grade: string | number,
    rollNumber: string | number,
    division: Divisions,
    excludeStudentId?: string,
  ): Promise<DuplicateCheckResult> {
    const query = {
      schoolId,
      grade: grade.toString(),
      rollNumber: rollNumber.toString(),
      division: division,
    };

    if (excludeStudentId) {
      Object.assign(query, { _id: { $ne: excludeStudentId } });
    }

    const existingStudent = await this.studentModel.findOne(query);

    if (existingStudent) {
      return {
        isDuplicate: true,
        existingStudent,
        message: `A student with roll number ${rollNumber} already exists in ${grade}${division}`,
      };
    }

    return { isDuplicate: false };
  }

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    const { schoolId } = createStudentDto;
    const school = await this.schoolModel.findById({
      _id: schoolId,
    });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    const duplicateCheck = await this.checkDuplicateStudent(
      createStudentDto.schoolId,
      createStudentDto.grade,
      createStudentDto.rollNumber,
      createStudentDto.division ?? Divisions.A,
    );
    if (duplicateCheck.isDuplicate) {
      throw new BadRequestException(duplicateCheck.message);
    }

    const customFieldsCopy = { ...createStudentDto.customFields };

    if (school.studentFields.length > 0) {
      this.validateCustomFields(school.studentFields, customFieldsCopy);
    }

    const student = await this.studentModel.create({
      ...createStudentDto,
      customFields: customFieldsCopy,
    });

    school.totalStudents += 1;
    await school.save();
    return this.findOne(student._id.toString());
  }

  async processCSVFile(
    file: Express.Multer.File,
    schoolId: string,
  ): Promise<CSVProcessingResult> {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!schoolId) throw new BadRequestException('No school ID provided');
    const school = await this.schoolModel.findById(schoolId);
    if (!school) throw new NotFoundException('School not found');

    const results: any[] = [];
    const errors: CSVError[] = [];
    const savePromises: Promise<any>[] = [];

    return new Promise((resolve, reject) => {
      const stream = Readable.from(file.buffer).pipe(csv());

      stream.on('data', (row) => {
        const task = (async () => {
          try {
            const {
              studentId,
              registrationNumber,
              firstName,
              middleName,
              lastName,
              dateOfBirth,
              gender,
              rollNumber,
              grade,
              division,
              ...customFieldParts
            } = row;

            const duplicateCheck = await this.checkDuplicateStudent(
              schoolId,
              grade,
              rollNumber,
              division,
            );

            if (duplicateCheck.isDuplicate) {
              errors.push({
                row,
                error: `Duplicate entry: ${duplicateCheck.message}`,
                type: 'DUPLICATE',
              });
              return;
            }

            const customFields = new Map(Object.entries(customFieldParts));
            if (school.studentFields) {
              this.validateCustomFields(school.studentFields, customFields);
            }

            const studentData = {
              studentId,
              registrationNumber,
              firstName,
              middleName: middleName || null,
              lastName,
              dateOfBirth: new Date(dateOfBirth).toISOString(),
              gender: gender.toLowerCase(),
              rollNumber: Number(rollNumber),
              grade: Number(grade),
              division: division || 'A',
              schoolId,
              customFields,
            };

            const student = new this.studentModel(studentData);
            await student.save().then((saved) => results.push(saved));
          } catch (err) {
            errors.push({ row, error: err.message, type: 'VALIDATION' });
          }
        })();

        savePromises.push(task);
      });

      stream.on('end', async () => {
        await Promise.allSettled(savePromises);

        const response: CSVProcessingResult = {
          success: true,
          message: 'CSV processing completed',
          summary: {
            total: results.length + errors.length,
            saved: results.length,
            failed: errors.length,
            duplicates: errors.filter((e) => e.type === 'DUPLICATE').length,
            validationFailed: errors.filter((e) => e.type === 'VALIDATION')
              .length,
          },
          errors,
          results,
        };

        if (results.length === 0 && errors.length > 0) {
          return reject(new BadRequestException(response));
        }

        resolve(response);

        school.totalStudents += results.length;
        await school.save();
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

  async findBySchool(schoolId: string): Promise<Student[]> {
    const school = await this.schoolModel.findById({ _id: schoolId });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    const students = await this.studentModel.find({ schoolId }).lean();
    return students;
  }

  async findOne(id: string): Promise<StudentResponseDto> {
    const student = await this.studentModel.findById(id);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.transformService.transform(StudentResponseDto, student);
  }

  async update(id: string, updateStudentDto: any): Promise<StudentResponseDto> {
    const student = await this.studentModel.findByIdAndUpdate(
      id,
      updateStudentDto,
      { new: true },
    );
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return this.transformService.transform(StudentResponseDto, student);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const student = await this.studentModel.findByIdAndDelete(id);
    const school = await this.schoolModel.findById({ _id: student?.schoolId });
    await this.logService.removeAllByStudentId(id);
    if (school) {
      school.totalStudents -= 1;
      await school.save();
    }
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return { deleted: true };
  }

  async removeAll(schoolId: string): Promise<{ deleted: boolean }> {
    const school = await this.schoolModel.findById({ _id: schoolId });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    await Promise.all([
      this.studentModel.deleteMany({ schoolId }).lean(),
      this.logModel.deleteMany({ schoolId }).lean(),
    ]);

    school.totalStudents = 0;
    await school.save();

    return { deleted: true };
  }

  private validateCustomFields(
    fieldDefinitions: { name: string; type: string; required: boolean }[],
    customFields: Map<string, any> | Record<string, any>,
  ) {
    const definedFieldNames = new Set(
      fieldDefinitions.map((field) => field.name),
    );

    const providedFieldNames = new Set(
      customFields instanceof Map
        ? [...customFields.keys()]
        : Object.keys(customFields),
    );

    if (!definedFieldNames && !providedFieldNames) {
      return;
    }

    if (!providedFieldNames.size) {
      const requiredFields = fieldDefinitions
        .filter((field) => field.required)
        .map((field) => field.name);

      throw new BadRequestException(
        `No fields provided. Required fields: ${requiredFields.join(', ')}`,
      );
    }

    const invalidFields = [...providedFieldNames].filter(
      (fieldName) => !definedFieldNames.has(fieldName),
    );
    if (invalidFields.length > 0) {
      throw new BadRequestException(
        `Invalid custom fields: ${invalidFields.join(
          ', ',
        )}. Allowed fields: ${[...definedFieldNames].join(', ')}`,
      );
    }

    for (const field of fieldDefinitions) {
      if (field.required) {
        const hasField =
          customFields instanceof Map
            ? customFields.has(field.name)
            : Object.prototype.hasOwnProperty.call(customFields, field.name);

        if (!hasField) {
          throw new BadRequestException(
            `Missing required field: ${field.name}`,
          );
        }
      }
    }

    const entries =
      customFields instanceof Map
        ? [...customFields.entries()]
        : Object.entries(customFields);

    for (const [key, value] of entries) {
      const fieldDef = fieldDefinitions.find((f) => f.name === key);
      if (!fieldDef) continue;

      switch (fieldDef.type) {
        case 'string':
          if (typeof value !== 'string') {
            throw new BadRequestException(`Field ${key} must be a string`);
          }
          break;

        case 'number':
          if (typeof value === 'string') {
            const parsed = Number(value);
            if (isNaN(parsed)) {
              throw new BadRequestException(
                `Field ${key} must be a valid number`,
              );
            }
            customFields instanceof Map
              ? customFields.set(key, parsed)
              : (customFields[key] = parsed);
          } else if (typeof value === 'number') {
            if (isNaN(value)) {
              throw new BadRequestException(
                `Field ${key} must be a valid number`,
              );
            }
          } else {
            throw new BadRequestException(`Field ${key} must be a number`);
          }
          break;

        case 'date':
          if (!(value instanceof Date) && isNaN(Date.parse(value))) {
            throw new BadRequestException(`Field ${key} must be a valid date`);
          }
          break;

        case 'boolean':
          if (typeof value === 'boolean') {
            break;
          }
          if (typeof value === 'string') {
            const lowered = value.toLowerCase();
            if (lowered === 'true') {
              customFields instanceof Map
                ? customFields.set(key, true)
                : (customFields[key] = true);
            } else if (lowered === 'false') {
              customFields instanceof Map
                ? customFields.set(key, false)
                : (customFields[key] = false);
            } else {
              throw new BadRequestException(
                `Field ${key} must be a boolean (true/false)`,
              );
            }
          } else {
            throw new BadRequestException(
              `Field ${key} must be a boolean (true/false)`,
            );
          }
          break;

        default:
          throw new BadRequestException(
            `Unsupported field type for ${key}: ${fieldDef.type}`,
          );
      }
    }
  }
}
