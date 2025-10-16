import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from 'src/schema/user.schema';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/user.interface';
import { Types } from 'mongoose';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(createUserDto);
  }

  @Get('/me')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.SUB_ADMIN,
    UserRole.TEACHER,
  )
  async getMe(@CurrentUser() user: AuthUser) {
    const userId =
      user._id instanceof Types.ObjectId ? user.id.toString() : String(user.id);
    return await this.userService.findMe(userId);
  }

  @Get('/teachers/:schoolId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SUB_ADMIN)
  async findSchoolTeachers(
    @Param('schoolId') schoolId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return await this.userService.findSchoolTeachers(query, schoolId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
