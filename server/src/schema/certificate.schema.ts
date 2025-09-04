import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Certificate extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  templateCode: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'School', index: true })
  schoolId: Types.ObjectId;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
