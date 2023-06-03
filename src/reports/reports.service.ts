import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './reports.shecma';
import { Model } from 'mongoose';
import { CreateReportDto } from './interfaces/report.dto';
import { randomUUID } from 'crypto';
import { TicketsService } from 'src/tickets/tickets.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { RobotsGateway } from './robots.gateway';
import { filter, first, timeout, catchError } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    private openAiService: OpenAiService,
    private ticketService: TicketsService,
    private robotsGateWay: RobotsGateway,
  ) {}

  async createReport(reportData: CreateReportDto) {
    const problem = reportData.message;
    const result = await this.openAiService.dataExtraction(problem);
    if (result) {
      if (!result.Error && !result.error) {
        const ticket = await this.ticketService.createTicket({
          problem_location: result.problem_location,
          problem_type: result.problem_type,
          summary: result.summary,
          bot_id: result.bot_id,
          status: 'open',
          username: reportData.username,
        });
        await this.robotsGateWay.askforHeartbeat(
          ticket.bot_id,
          ticket.ticket_id,
        );
        const botResponses$ = this.robotsGateWay.getBotResponses$();
        const response = await firstValueFrom(
          botResponses$.pipe(
            filter((response) => response.ticket_id === ticket.ticket_id),
            // timeout(10000),
            catchError(() => of(null)),
            first(),
          ),
        );
        const report = new this.reportModel({
          ...reportData,
          ticket: ticket._id.toString(),
          botHeartbeat: response?.heartbeat || null,
        });
        return await report.save();
      } else {
        return result;
      }
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
