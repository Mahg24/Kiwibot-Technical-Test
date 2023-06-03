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
import { CreateTicketDto, UpdateTicketDto } from './interfaces/ticket.dto';
import { TicketsService } from './tickets.service';
import { Response } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async getAlltickets(@Res() res: Response, @Query() query: any) {
    const tickets = await this.ticketsService.getTickets(query);
    if (tickets.length > 0) {
      res.status(HttpStatus.OK).json(tickets);
    } else {
      res.status(HttpStatus.NOT_FOUND).json([]);
    }
  }
  @Get(':id')
  async getOneticket(
    @Res() res: Response,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const Ticket = await this.ticketsService.getOneTicket({
      _id: id,
      ...query,
    });
    if (Ticket) {
      res.status(HttpStatus.OK).json(Ticket);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Ticket not found' });
    }
  }

  @Get('id/:id')
  async getOneby_idtickets(@Res() res: Response, @Param('id') id: string) {
    const Ticket = await this.ticketsService.getOneTicket({
      ticket_id: id,
    });
    if (Ticket) {
      res.status(HttpStatus.OK).json(Ticket);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Ticket not found' });
    }
  }

  @Put(':id')
  async updateTicket(
    @Res() res: Response,
    @Body() updateTicketData: UpdateTicketDto,
    @Param('id') id: string,
  ) {
    const Ticket = await this.ticketsService.updateTicket(id, updateTicketData);
    if (Ticket) {
      res.status(HttpStatus.OK).json(Ticket);
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Ticket not found' });
    }
  }
}
