import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { UserRole } from '../schema/user.schema';

@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  create(@Body() createStudentDto: any) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findAll() {
    return this.studentService.findAll();
  }

  @Get('school/:schoolId')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.studentService.findBySchool(schoolId);
  }

  @Get('class/:classId')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findByClass(@Param('classId') classId: string) {
    return this.studentService.findByClass(classId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  update(@Param('id') id: string, @Body() updateStudentDto: any) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
