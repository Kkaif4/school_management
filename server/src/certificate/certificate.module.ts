import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { Certificate } from 'crypto';
import { CertificateSchema } from 'src/schema/certificate.schema';
import { LogModule } from 'src/log/log.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/schema/student.schema';
import { Log, LogSchema } from 'src/schema/log.schema';
import { UserModule } from 'src/user/user.module';
import { StudentModule } from 'src/student/student.module';
import { School, SchoolSchema } from 'src/schema/school.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Log.name, schema: LogSchema },
      { name: School.name, schema: SchoolSchema },
    ]),
    LogModule,
    StudentModule,
    UserModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
