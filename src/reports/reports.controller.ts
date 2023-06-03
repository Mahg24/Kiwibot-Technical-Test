import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Res,
  Query,
  Param,
  Get,
} from '@nestjs/common';
import { CreateReportDto } from './interfaces/report.dto';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /* This is a method in the `ReportsController` class that handles a POST request to create a new
  report. It uses the `@Post()` decorator to specify that this method should handle POST requests.
  The `@Res()` decorator injects the Express response object, which is used to send the response
  back to the client. The `@Body()` decorator injects the request body, which is an instance of
  `CreateReportDto`. */
  @Post()
  async createTicket(
    @Res() res: Response,
    @Body() createTicketData: CreateReportDto,
  ) {
    const report = await this.reportsService.createReport(createTicketData);
    if (report) {
      if (!report.Error && !report.error) {
        res.status(HttpStatus.CREATED).json(report);
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(report);
      }
    } else {
      res
        .status(HttpStatus.SERVICE_UNAVAILABLE)
        .json({ error: 'Please try later' });
    }
  }

  /* This is a method in the `ReportsController` class that handles a GET request to retrieve all
  reports. It uses the `@Get()` decorator to specify that this method should handle GET requests.
  The `@Res()` decorator injects the Express response object, which is used to send the response
  back to the client. The `@Query()` decorator injects the query parameters from the request URL.
  The method then calls the `getReports()` method from the `ReportsService` to retrieve all reports
  based on the query parameters. If there are reports, it sends an HTTP status code of 200 (OK) and
  returns the reports in JSON format. If there are no reports, it sends an HTTP status code of 404
  (NOT FOUND) and returns an empty array in JSON format. */
  @Get()
  async getAllReports(@Res() res: Response, @Query() query: any) {
    const reports = await this.reportsService.getReports(query);
    if (reports.length > 0) {
      res.status(HttpStatus.OK).json(reports);
    } else {
      res.status(HttpStatus.NOT_FOUND).json([]);
    }
  }

  /* This is a method in the `ReportsController` class that handles a GET request to retrieve a single
  report by its ID. It uses the `@Get(':id')` decorator to specify that this method should handle
  GET requests with a dynamic parameter `id` in the URL. The `@Res()` decorator injects the Express
  response object, which is used to send the response back to the client. The `@Param('id')`
  decorator injects the `id` parameter from the request URL. The `@Query()` decorator injects the
  query parameters from the request URL. The method then calls the `getOneReport()` method from the
  `ReportsService` to retrieve the report with the specified ID and query parameters. If the report
  is found, it sends an HTTP status code of 200 (OK) and returns the report in JSON format. If the
  report is not found, it sends an HTTP status code of 404 (NOT FOUND) and returns an error message
  in JSON format. */
  @Get(':id')
  async getOneReports(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const report = await this.reportsService.getOneReport({
      _id: id,
      ...query,
    });
    if (report) {
      res.status(HttpStatus.OK).json(report);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Report not found' });
    }
  }

  /* This is a method in the `ReportsController` class that handles a GET request to retrieve a single
 report by its `ticket_id`. It uses the `@Get('ticket/:id')` decorator to specify that this method
 should handle GET requests with a dynamic parameter `id` in the URL, which represents the
 `ticket_id`. The `@Res()` decorator injects the Express response object, which is used to send the
 response back to the client. The `@Param('id')` decorator injects the `id` parameter from the
 request URL, which represents the `ticket_id`. The method then calls the `getOneReport()` method
 from the `ReportsService` to retrieve the report with the specified `ticket_id`. If the report is
 found, it sends an HTTP status code of 200 (OK) and returns the report in JSON format. If the
 report is not found, it sends an HTTP status code of 404 (NOT FOUND) and returns an error message
 in JSON format. */
  @Get('ticket/:id')
  async getOnebyticket_id(@Res() res: Response, @Param('id') id: string) {
    const report = await this.reportsService.getOneReport({
      ticket_id: id,
    });
    if (report) {
      res.status(HttpStatus.OK).json(report);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Report not found' });
    }
  }
}
