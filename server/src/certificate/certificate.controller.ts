import {
  Param,
  UseGuards,
  Controller,
  Get,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/schema/user.schema';
import { Divisions, Gender } from 'src/schema/student.schema';
import { LogService } from 'src/log/log.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CreateLogDto } from 'src/log/dto/create-log.dto';
import { StudentService } from 'src/student/student.service';

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
  constructor(
    private readonly certificateService: CertificateService,
    private readonly logService: LogService,
    private readonly studentService: StudentService,
  ) {}
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
    @Req() req: Request,
  ) {
    const result = await this.certificateService.generateCertificate(data);

    try {
      const user = req['user'];
      if (!user?.id) {
        console.error('Missing user data in request');
        return result;
      }
      const logData: CreateLogDto = {
        userId: user.id.toString(),
        studentId: data.studentId,
        documentType: 'certificate',
        documentId: data.certificateId,
        message: `${result.message} by ${user.name || 'User'}`,
        action: 'print',
      };

      if (result) {
        await this.logService.createLog(logData);
      }
    } catch (err) {
      console.error('Error creating log:', err.message);
    }
    return result;
  }
}
