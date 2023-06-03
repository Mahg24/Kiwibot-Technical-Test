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

  @Get()
  async getAllReports(@Res() res: Response, @Query() query: any) {
    const reports = await this.reportsService.getReports(query);
    if (reports.length > 0) {
      res.status(HttpStatus.OK).json(reports);
    } else {
      res.status(HttpStatus.NOT_FOUND).json([]);
    }
  }
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
