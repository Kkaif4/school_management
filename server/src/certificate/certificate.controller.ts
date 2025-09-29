import {
  Req,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/schema/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';

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

  @Get(':schoolId/:studentId/:certificateId')
  async generateCertificate(
    @Param()
    data: { schoolId: string; studentId: string; certificateId: string },
    @Req() req: Request,
  ) {
    return await this.certificateService.generateCertificate(data, req);
  }
}
