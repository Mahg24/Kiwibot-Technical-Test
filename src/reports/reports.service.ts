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

  /**
   * This function creates a report by extracting data from a problem message and ask for a heartbeat to the robot , creating a ticket, and
   * saving the report.
   * @param {CreateReportDto} reportData - CreateReportDto, which is a data transfer object containing
   * information about a report being created.
   * @returns either a report object (if the data extraction is successful), an error object (if there is
   * an error during data extraction), or null (if the result is falsy).
   */
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
            timeout(10000),
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

  /**
   * This function retrieves reports from a database based on a given query.
   * @param query - The query parameter is an object that specifies the conditions that the documents
   * must meet in order to be returned by the find method. It can include various properties such as
   * field names, comparison operators, and logical operators. The query is used to filter the documents
   * in the collection and return only those that match the
   * @returns This function is returning a promise that resolves to an array of documents from the
   * reportModel collection in the database that match the given query. The function is using the
   * `await` keyword to wait for the database query to complete before returning the results.
   */
  async getReports(query) {
    return await this.reportModel.find(query);
  }

  /**
   * This function retrieves one report from a report model based on a given query.
   * @param query - The query parameter is an object that specifies the conditions that the findOne
   * method will use to search for a document in the reportModel collection. It can contain one or more
   * key-value pairs that represent the fields and values to match in the document. For example, { _id:
   * '12345' }
   * @returns This function is returning a promise that resolves to the result of finding one document
   * in the reportModel collection that matches the given query.
   */
  async getOneReport(query) {
    return await this.reportModel.findOne(query);
  }
}
