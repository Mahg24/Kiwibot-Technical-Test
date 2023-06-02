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
import { CreateTicketDto, UpdateTicketDto } from './interfaces/report.dto';
import { ReportsService } from './reports.service';
import { Response, query } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  async createTicket(
    @Res() res: Response,
    @Body() createTicketData: CreateTicketDto,
  ) {
    const report = await this.reportsService.createReport(createTicketData);
    res.status(HttpStatus.CREATED).json(report);
  }

  @Get()
  async getAllReports(@Res() res: Response, @Param() query: any) {
    const reports = await this.reportsService.getReports(query);
    res.status(HttpStatus.OK).json(reports);
  }
  @Get(':id')
  async getOneReports(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const reports = await this.reportsService.getOneReport({
      _id: id,
      ...query,
    });
    res.status(HttpStatus.OK).json(reports);
  }

  @Get('ticket/:id')
  async getOnebyticket_idReports(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const reports = await this.reportsService.getOneReport({
      ticket_id: id,
    });
    res.status(HttpStatus.OK).json(reports);
  }

  @Put(':id')
  async updateTicket(
    @Res() res: Response,
    @Body() updateReportData: UpdateTicketDto,
    @Param('id') id: string,
  ) {
    const report = await this.reportsService.updateReport(id, updateReportData);
    res.status(HttpStatus.OK).json(report);
  }
}
