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
import { Bonafide } from 'src/utils/bonafide';
import { Student } from 'src/schema/student.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    await this.certificateModel.create(createCertificateDto);
    const result = {
      success: true,
      message: 'Certificate template created successfully',
    };
    return result;
  }

  async generateCertificate(data: {
    studentId: string;
    certificateId: string;
  }) {
    try {
      const student = await this.studentModel.findById({ _id: data.studentId });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      const certificate = await this.certificateModel.findOne({
        _id: data.certificateId,
      });

      if (!certificate) {
        throw new NotFoundException('Certificate template not found');
      }

      const template = Handlebars.compile(certificate.templateCode);

      const newCertificate = template({
        firstName: student.firstName,
        middleName: student.middleName ?? '',
        lastName: student.lastName,
        fatherName: student.fatherName,
        motherName: student.motherName,
        dateOfBirth: student.dateOfBirth,
        birthPlace: student.birthPlace,
        gender: student.gender,
        nationality: student.nationality,
        religion: student.religion,
        cast: student.cast,
        adhaar: student.adhaar,
        registerNumber: student.registerNumber,
        rollNumber: String(student.rollNumber),
        grade: String(student.grade),
        division: student.division,
        admissionDate: student.admissionDate,
        previousSchoolName: student.previousSchoolName ?? '',
        address: student.address,
        contactNumber: student.contactNumber,
      });

      return newCertificate;
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
      if (!certificates || certificates.length === 0) {
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
