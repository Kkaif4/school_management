import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { School } from './school.schema';
import { User } from './user.schema';

export enum Sections {
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
export class Class extends Document {
  @Prop({ required: true })
  grade: number;

  @Prop({ required: true, enum: Sections, default: Sections.A })
  section: Sections;

  @Prop({ type: Types.ObjectId, ref: School.name, required: true, index: true })
  schoolId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  createdBy: Types.ObjectId;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
