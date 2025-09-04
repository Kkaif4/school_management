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
    console.log('Creating log with data:', logData);
    try {
      // Convert string IDs to ObjectIds
      const formattedLogData = {
        ...logData,
        userId: new Types.ObjectId(logData.userId),
        studentId: new Types.ObjectId(logData.studentId),
        documentId: new Types.ObjectId(logData.documentId),
      };

      const log = await this.logModel.create(formattedLogData);
      console.log('Log created successfully:', log);
      return log;
    } catch (error) {
      console.error('Error creating log:', error.message);
      if (error.name === 'ValidationError') {
        console.error('Validation errors:', error.errors);
      }
      return null;
    }
  }

  async getLogsByStudent(
    studentId: string,
    options: {
      page?: number;
      limit?: number;
      sort?: 'asc' | 'desc';
      documentType?: string;
    },
  ) {
    try {
      const { page = 1, limit = 20, sort = 'desc', documentType } = options;
      const skip = (page - 1) * limit;
      const query: any = { studentId: new Types.ObjectId(studentId) };

      if (documentType) {
        query.documentType = documentType;
      }

      const [logs, total] = await Promise.all([
        this.logModel
          .find(query)
          .sort({ createdAt: sort === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email')
          .populate('studentId', 'firstName lastName rollNumber')
          .lean(),
        this.logModel.countDocuments(query),
      ]);

      return {
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching student logs:', error);
      return {
        success: false,
        message: 'Failed to fetch student logs',
      };
    }
  }

  async getLogsBySchool(
    schoolId: string,
    options: {
      page?: number;
      limit?: number;
      sort?: 'asc' | 'desc';
      documentType?: string;
    },
  ) {
    try {
      const { page = 1, limit = 20, sort = 'desc', documentType } = options;
      const skip = (page - 1) * limit;
      const query: any = { schoolId: new Types.ObjectId(schoolId) };

      if (documentType) {
        query.documentType = documentType;
      }

      const [logs, total] = await Promise.all([
        this.logModel
          .find(query)
          .sort({ createdAt: sort === 'desc' ? -1 : 1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email')
          .populate('studentId', 'firstName lastName rollNumber')
          .lean(),
        this.logModel.countDocuments(query),
      ]);

      return {
        success: true,
        data: logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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
