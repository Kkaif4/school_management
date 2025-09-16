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
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../schema/user.schema';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentArrayResponse } from './dto/student-response.dto';

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
    console.log({ schoolId }, 'calling processCSVFile');
    const res = await this.studentService.processCSVFile(file, schoolId);
    console.log({ res });
    return res;
  }

  @Get()
  @Roles(UserRole.SUB_ADMIN)
  findAll(): Promise<StudentArrayResponse> {
    return this.studentService.findAll();
  }

  @Get(':schoolId')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.TEACHER,
  )
  findBySchool(
    @Param('schoolId') schoolId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<StudentArrayResponse> {
    return this.studentService.findBySchool(schoolId, page, limit, sort, order);
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
