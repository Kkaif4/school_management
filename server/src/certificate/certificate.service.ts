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
import { AuthUser } from 'src/common/interfaces/user.interface';
import { CertificateResponseDto } from './dto/certificate-response.dto';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<Student>,
    @InjectModel(Log.name) private readonly logService: Model<Log>,
    private readonly transformService: ResponseTransformService,
  ) {}

  async create(
    createCertificateDto: CreateCertificateDto,
  ): Promise<CertificateResponseDto> {
    const certificate =
      await this.certificateModel.create(createCertificateDto);
    return this.findOne(certificate._id.toString());
  }

  async findOne(id: string): Promise<CertificateResponseDto> {
    const certificate = await this.certificateModel.findById({ _id: id });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return this.transformService.transform(CertificateResponseDto, certificate);
  }

  async generateCertificate(
    data: { schoolId: string; studentId: string; certificateId: string },
    user: AuthUser,
  ) {
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

      // Clean template and compile
      const cleanTemplateCode = certificate.templateCode.replace(/\\n/g, '');
      const template = Handlebars.compile(cleanTemplateCode);
      // Prepare replacements for Handlebars
      const replacements: Record<string, any> = {
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
        ...student.customFields,
      };

      const newCertificate = template(replacements);

      // Logging
      try {
        const logData = {
          action: 'Generate Certificate',
          message: `generated ${certificate.name} for student ${student.firstName} ${student.lastName} by ${user.name}`,
          timestamp: new Date(),
          documentId: certificate._id,
          documentType: certificate.name,
          studentId: student._id,
          userId: user.id.toString(),
          schoolId: data.schoolId,
        };
        await this.logService.create(logData);
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
    const certificates = await this.certificateModel.find({ schoolId });
    return certificates;
  }

  async remove(id: string) {
    const certificate = await this.certificateModel.findByIdAndDelete(id);
    if (!certificate) {
      throw new NotFoundException('Certificate template not found');
    }
    return {
      success: true,
      message: 'Certificate template deleted successfully',
    };
  }
  async removeAllBySchoolId(schoolId: string) {
    try {
      const result = await this.certificateModel.deleteMany({ schoolId });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error removing school certificates:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to remove school certificates';
      throw new BadRequestException(message);
    }
  }
}
