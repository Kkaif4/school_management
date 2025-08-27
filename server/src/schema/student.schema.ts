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
  @Prop({ required: true, unique: true })
  studentId: number;

  @Prop({ required: true, unique: true })
  registerNumber: number;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  middleName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  birthPlace: string;

  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  rollNumber: number;

  @Prop({ required: true })
  fatherName: string;

  @Prop({ required: true })
  motherName: string;

  @Prop({
    type: String,
    required: true,
    match: [
      /^[2-9][0-9]{11}$/,
      'Aadhaar must be 12 digits and cannot start with 0 or 1',
    ],
  })
  adhaar: string;

  @Prop({ required: true })
  cast: string;

  @Prop({ required: true })
  religion: string;

  @Prop({ required: true })
  nationality: string;

  @Prop({ required: true, min: 1, max: 12 })
  grade: number;

  @Prop({ required: true, enum: Divisions, default: Divisions.A })
  division: Divisions;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  previousSchoolName: string;

  @Prop({ required: true })
  admissionDate: Date;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true, index: true })
  schoolId: Types.ObjectId;
}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);
