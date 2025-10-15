import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Log } from '../schema/log.schema';
import { CreateLogDto } from './dto/create-log.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { PaginationUtil } from 'src/utils/pagination.utils';
import { LogResponseDto } from './dto/log-response.dto';
import { ResponseTransformService } from 'src/services/responseTransformer.service';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name)
    private readonly logModel: Model<Log>,
    private readonly transformService: ResponseTransformService,
  ) {}

  async createLog(logData: CreateLogDto): Promise<Log | null> {
    try {
      const log = await this.logModel.create(logData);
      return log;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating log:', error.message);
        if (error.name === 'ValidationError') {
          console.error('Validation errors:', (error as any).errors);
        }
      } else {
        console.error('An unknown error occurred:', error);
      }
      return null;
    }
  }
  async getLogsByStudent(query: PaginationQueryDto, studentId: string) {
    try {
      // 1. Validate pagination params
      const { page, limit } = PaginationUtil.validatePaginationParams(
        query.page,
        query.limit,
      );

      const combinedQuery: FilterQuery<Log> = {
        studentId: new Types.ObjectId(studentId),
      };

      const [logs, total] = await Promise.all([
        this.logModel.find(combinedQuery).sort({ createdAt: -1 }).lean(),
        this.logModel.countDocuments(combinedQuery),
      ]);
      console.log(logs);

      const meta = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      };

      return this.transformService.transformPaginatedResponse(
        LogResponseDto,
        logs,
        meta,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch student logs';
      throw new BadRequestException(message);
    }
  }

  async getLogsBySchool(schoolId: string) {
    try {
      const query: FilterQuery<Log> = {
        schoolId: new Types.ObjectId(schoolId),
      };

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
      const message =
        error instanceof Error ? error.message : 'Failed to fetch school logs';
      throw new BadRequestException(message);
    }
  }
}
