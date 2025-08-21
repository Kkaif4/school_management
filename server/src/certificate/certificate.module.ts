import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { Certificate } from 'crypto';
import { CertificateSchema } from 'src/schema/certificate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/schema/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
