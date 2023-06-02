import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './reports.shecma';
import { Model } from 'mongoose';
import { CreateTicketDto, UpdateTicketDto } from './interfaces/report.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { error } from 'console';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private configService: ConfigService,
    private openAiService: OpenAiService,
  ) {}

  async createReport(reportData: CreateTicketDto) {
    const bot_id = reportData.bot_id;
    const problem = reportData.message;
    const result = await this.openAiService.dataExtraction(problem);

    if (result) {
      if (!result.Error && !result.error) {
        const report = new this.reportModel({
          ticket_id: `${randomUUID().toString()}-${bot_id}`,
          problem_location: result.problem_location,
          problem_type: result.problem_type,
          summary: result.summary,
          bot_id,
          status: 'open',
        });
        return await report.save();
      } else {
        return result;
      }
    } else {
      return null;
    }
  }

  async updateReport(id: string, reportStatus: UpdateTicketDto) {
    const report = await this.reportModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: reportStatus.status,
        },
      },
      { new: true },
    );
    if (report) {
      return report;
    } else {
      return null;
    }
  }

  async getReports(query) {
    return await this.reportModel.find(query);
  }

  async getOneReport(query) {
    return await this.reportModel.findOne(query);
  }
}
