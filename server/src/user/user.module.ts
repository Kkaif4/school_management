import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../schema/user.schema';
import { School, SchoolSchema } from 'src/schema/school.schema';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: School.name, schema: SchoolSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ResponseTransformService],
  exports: [UserService],
})
export class UserModule {}
