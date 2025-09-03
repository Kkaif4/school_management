import { Param, UseGuards, Controller, Get, Post, Body } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/schema/user.schema';
import { Divisions, Gender } from 'src/schema/student.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';

export interface StudentData {
  firstName: string;
  middleName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: Gender;
  rollNumber: string;
  grade: number;
  division: Divisions;
  contactNumber: string;
}

@Controller('certificate')
@UseGuards(AuthGuard, RolesGuard)
@Roles(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.SUB_ADMIN,
  UserRole.TEACHER,
)
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAll(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificateService.create(createCertificateDto);
  }

  @Get(':id')
  async findAllCertificates(@Param('id') schoolId: string) {
    return await this.certificateService.findCertificates(schoolId);
  }

  @Get(':studentId/:certificateId')
  async generateCertificate(
    @Param() data: { studentId: string; certificateId: string },
  ) {
    return await this.certificateService.generateCertificate(data);
  }
}
