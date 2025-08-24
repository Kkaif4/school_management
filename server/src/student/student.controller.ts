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
import { StudentArrayResponse, StudentService } from './student.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { UserRole } from '../schema/user.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';

@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  async create(@Body() createStudentDto: CreateStudentDto) {
    console.log('here im in post end point of student');
    return await this.studentService.create(createStudentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findAll(): Promise<StudentArrayResponse> {
    return this.studentService.findAll();
  }

  @Get('school/:schoolId')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findBySchool(
    @Param('schoolId') schoolId: string,
  ): Promise<StudentArrayResponse> {
    return this.studentService.findBySchool(schoolId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: any,
  ): Promise<StudentResponseDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
