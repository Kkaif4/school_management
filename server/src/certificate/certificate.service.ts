// certificate.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Handlebars from 'handlebars';
import { Certificate } from '../schema/certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Student } from 'src/schema/student.schema';
import { School } from 'src/schema/school.schema';
import { Log } from 'src/schema/log.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
    @InjectModel(School.name)
    private readonly schoolModel: Model<School>,
    @InjectModel(Log.name) private readonly logService: Model<Log>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    await this.certificateModel.create(createCertificateDto);
    const result = {
      success: true,
      message: 'Certificate template created successfully',
    };
    return result;
  }

  async generateCertificate(
    data: {
      schoolId: string;
      studentId: string;
      certificateId: string;
    },
    req: Request,
  ) {
    try {
      const student = await this.studentModel.findById({ _id: data.studentId });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const certificate = await this.certificateModel.findOne({
        _id: data.certificateId,
      });

      const school = await this.schoolModel.findOne({ _id: data.schoolId });

      if (!school) {
        throw new NotFoundException('School not found for the student');
      }
      if (!certificate) {
        throw new NotFoundException('Certificate template not found');
      }

      let cleanTemplateCode = certificate.templateCode.replace(/\\n/g, '');
      const template = Handlebars.compile(cleanTemplateCode);

      const customFieldsObj = Object.fromEntries(student.customFields);
      const newCertificate = template({
        studentId: student.studentId,
        registrationNumber: student.registrationNumber,
        firstName: student.firstName,
        middleName: student.middleName ?? '',
        lastName: student.lastName,
        dateOfBirth: new Date(student.dateOfBirth).toLocaleDateString('en-GB'),
        gender: student.gender,
        grade: student.grade,
        division: student.division,
        rollNumber: student.rollNumber,

        // Add this for dynamic fields
        customFields: customFieldsObj || {},
      });

      try {
        const logData = {
          action: 'Generate Certificate',
          message: `generated ${certificate.name} for student ${student.firstName} ${student.lastName} by ${req['user'].name}`,
          timestamp: new Date(),
          documentId: certificate._id,
          documentType: certificate.name,
          studentId: student._id,
          userId: req['user'].id.toString(),
          schoolId: data.schoolId,
        };

        const log = await this.logService.create(logData);
      } catch (error) {
        console.error('Failed to log certificate generation action:', error);
      }
      return {
        success: true,
        message: `${certificate.name} generated for ${student.firstName} ${student.lastName}`,
        data: newCertificate,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'An error occurred while generating the certificate',
      );
    }
  }

  async findCertificates(schoolId: string) {
    try {
      const certificates = await this.certificateModel.find({ schoolId });
      if (!certificates) {
        throw new NotFoundException('No certificate templates found');
      }
      return certificates;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message ||
          'An error occurred while fetching the certificate templates',
      );
    }
  }
}
