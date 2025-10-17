import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/schema/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/user.interface';

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
  async create(@Body() createCertificateDto: CreateCertificateDto) {
    return await this.certificateService.create(createCertificateDto);
  }

  @Get(':schoolId')
  async findAllCertificates(@Param('schoolId') schoolId: string) {
    return await this.certificateService.findCertificates(schoolId);
  }

  @Get(':schoolId/:studentId/:certificateId')
  async generateCertificate(
    @Param()
    data: { schoolId: string; studentId: string; certificateId: string },
    @CurrentUser() user: AuthUser,
  ) {
    return await this.certificateService.generateCertificate(data, user);
  }

  // delete
  @Delete(':id')
  async deleteCertificate(@Param('id') id: string) {
    return await this.certificateService.remove(id);
  }
}
