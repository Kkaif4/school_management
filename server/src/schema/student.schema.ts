import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { School } from './school.schema';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Divisions {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
}

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, unique: true })
  studentId: string;

  @Prop({ required: true, unique: true })
  registrationNumber: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  middleName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true, enum: Divisions, default: Divisions.A })
  division: Divisions;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  grade: number;

  @Prop({ type: Map, of: mongoose.Schema.Types.Mixed, default: {} })
  customFields: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true, index: true })
  schoolId: Types.ObjectId;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
