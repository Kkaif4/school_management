// certificate.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newCertificate =
      await this.certificateModel.create(createCertificateDto);
    const result = {
      success: true,
      message: 'Certificate template created successfully',
      data: newCertificate,
    };
    return result;
  }

  async generateCertificate(id: string) {
    try {
      const student = await this.studentModel.findById({ _id: id });
      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const template = Handlebars.compile(Bonafide);
      const newCertificate = template({
        student_name: student.firstName,
        father_name: student.fatherName,
        mother_name: student.motherName,
        dob: student.dateOfBirth,
        grade: student.grade,
        division: student.division,
        school_name: 'ABC School',
      });

      return newCertificate;
    } catch (error) {
      throw new NotFoundException('Student not found');
    }
  }
}
