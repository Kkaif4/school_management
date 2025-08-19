import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { School } from './school.schema';
import { Class } from './class.schema';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true, index: true })
  school: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Class.name, required: true, index: true })
  class: Types.ObjectId;

  @Prop()
  guardianName: string;

  @Prop()
  guardianContact: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
