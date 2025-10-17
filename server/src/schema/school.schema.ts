import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ _id: false })
class FieldDefinition {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  defaultValue?: any;
}

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  principalName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  adminId: Types.ObjectId;

  @Prop({ required: false, default: null })
  address?: string;

  @Prop({ required: false, default: null })
  contactNumber?: string;

  @Prop({ default: 0 })
  totalStudents: number;

  @Prop({ default: 0 })
  totalTeachers: number;

  @Prop({ type: [FieldDefinition], default: [] })
  studentFields: FieldDefinition[];

  @Prop({ default: true })
  isActive: boolean;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

SchoolSchema.index({ name: 1, adminId: 1 }, { unique: true });
