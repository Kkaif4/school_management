import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { UserRole } from 'src/schema/user.schema';

@Controller('logs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get(':studentId')
  async getStudentLogs(
    @Param('studentId') studentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('documentType') documentType?: string,
  ) {
    return this.logService.getLogsByStudent(studentId, {
      page,
      limit,
      sort,
      documentType,
    });
  }

  @Get('school/:schoolId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getSchoolLogs(
    @Param('schoolId') schoolId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('documentType') documentType?: string,
  ) {
    return this.logService.getLogsBySchool(schoolId, {
      page,
      limit,
      sort,
      documentType,
    });
  }
}
