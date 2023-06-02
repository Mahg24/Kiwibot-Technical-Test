import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './reports.shecma';
import { Model } from 'mongoose';
import { CreateTicketDto, UpdateTicketDto } from './interfaces/report.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
const { Configuration, OpenAIApi } = require('openai');
let configuration;
@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private configService: ConfigService,
  ) {
    configuration = new Configuration({
      apiKey: configService.get<string>('openai_api_key'),
    });
  }

  async createReport(reportData: CreateTicketDto) {
    const bot_id = reportData.bot_id;
    const problem = reportData.message;
    const result = await this.dataExtraction(problem);
    if (result) {
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

  async dataExtraction(problem: string) {
    const openai = new OpenAIApi(configuration);
    const prompt = `extract the problem location, the problem type (software, hardware, field) and a summary in a json format from this ticket also if the ticket is in another lenguaje translate the summary to english :${problem}`;
    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.7,
        max_tokens: 70,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const result = completion.data.choices[0].text.replace(
        /(\r\n|\n|\r)/gm,
        '',
      );
      console.log(JSON.parse(result));
      return JSON.parse(result);
    } catch (e) {
      error(e);
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
