import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { Log, LogSchema } from '../schema/log.schema';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [LogController],
  providers: [LogService, ResponseTransformService],
  exports: [LogService],
})
export class LogModule {}
