import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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

@Schema({ timestamps: true })
export class Student extends Document {
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

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  fatherName: string;

  @Prop({ required: true })
  motherName: string;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true, index: true })
  schoolId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 12 })
  grade: number;

  @Prop({ required: true, enum: Divisions, default: Divisions.A })
  division: Divisions;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  address: string;
}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);
