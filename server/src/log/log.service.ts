import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Log } from '../schema/log.schema';
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>,
  ) {}

  async createLog(logData: CreateLogDto): Promise<Log | null> {
    try {
      const log = await this.logModel.create(logData);
      return log;
    } catch (error) {
      console.error('Error creating log:', error.message);
      if (error.name === 'ValidationError') {
        console.error('Validation errors:', error.errors);
      }
      return null;
    }
  }

  async getLogsByStudent(studentId: string) {
    try {
      const query: any = { studentId: new Types.ObjectId(studentId) };
      const logs = await this.logModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .populate('studentId', 'firstName lastName rollNumber')
        .lean();

      return {
        success: true,
        data: logs,
      };
    } catch (error) {
      console.error('Error fetching student logs:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch student logs',
      };
    }
  }

  async getLogsBySchool(schoolId: string) {
    try {
      const query: any = { schoolId: new Types.ObjectId(schoolId) };

      const logs = await this.logModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate('userId', 'name email')
        .populate('studentId', 'firstName lastName rollNumber')
        .lean();

      return {
        success: true,
        data: logs,
      };
    } catch (error) {
      console.error('Error fetching school logs:', error);
      return {
        success: false,
        message: 'Failed to fetch school logs',
      };
    }
  }
}
