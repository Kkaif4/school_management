import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/common/interfaces/user.interface';
import { User } from 'src/schema/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint');
    }
    return {
      id: user._id,
      name: user.name,
      role: user.role,
    };
  }
}
