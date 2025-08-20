import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../decorator/roles.decorator';
import { UserRole } from '../schema/user.schema';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('class')
@UseGuards(AuthGuard, RolesGuard)
@Roles(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.SUB_ADMIN,
  UserRole.TEACHER,
)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto, @Req() req: Request) {
    return await this.classService.create(req, createClassDto);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }

  @Get('school/:schoolId')
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.classService.findBySchool(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  update(@Param('id') id: string, @Body() updateClassDto: any) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUB_ADMIN)
  remove(@Param('id') id: string) {
    return this.classService.remove(id);
  }
}
