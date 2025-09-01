import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user._id };
    const token = this.jwtService.sign(payload);

    const response = {
      success: true,
      message: `${user.role} logged in successfully`,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };

    return response;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email } = registerDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    const user = await this.userModel.create(registerDto);

    const payload = { id: user._id };
    const token = this.jwtService.sign(payload);

    const response = {
      success: true,
      message: `User registered successfully`,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
    return response;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
