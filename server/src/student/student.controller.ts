import {
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserRole } from '../schema/user.schema';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  async createBulk(
    @UploadedFile() file: Express.Multer.File,
    @Body('schoolId') schoolId: string,
  ) {
    const res = await this.studentService.processCSVFile(file, schoolId);
    return res;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentService.findOne(id);
  }

  @Get('/school/:schoolId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.TEACHER,
  )
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.studentService.findBySchool(schoolId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: any,
  ): Promise<StudentResponseDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete('all/:id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  async removeAll(@Param('id') schoolId: string) {
    return await this.studentService.removeAll(schoolId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
