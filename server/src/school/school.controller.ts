import {
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { UserRole } from '../schema/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SchoolResponseDto } from './dto/school-response.dto';

@Controller('school')
@UseGuards(AuthGuard, RolesGuard)
@Roles(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.SUB_ADMIN,
  UserRole.TEACHER,
)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async create(@Body() createSchoolDto: CreateSchoolDto, @Req() req: Request) {
    return await this.schoolService.create(req, createSchoolDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return await this.schoolService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN)
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<SchoolResponseDto> {
    try {
      const school = await this.schoolService.remove(id);
      return {
        success: true,
        message: 'School deleted successfully',
        data: school,
      };
    } catch (error) {
      throw new NotFoundException('School not found');
    }
  }
}
