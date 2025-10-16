import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { School, SchoolSchema } from '../schema/school.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService, ResponseTransformService],
  exports: [SchoolService],
})
export class SchoolModule {}
