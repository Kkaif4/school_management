import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/schema/user.schema';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Controller('logs')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get(':studentId')
  async getStudentLogs(
    @Param('studentId') studentId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.logService.getLogsByStudent(query, studentId);
  }

  @Get('school/:schoolId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async getSchoolLogs(@Param('schoolId') schoolId: string) {
    return this.logService.getLogsBySchool(schoolId);
  }
}
