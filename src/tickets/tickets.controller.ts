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

  /* This is a method in the `TicketsController` class that handles a GET request to retrieve all
  tickets. It uses the `@Get()` decorator to specify the endpoint for the request. The `@Res()`
  decorator is used to inject the `Response` object from the `express` library, which is used to
  send the response back to the client. The `@Query()` decorator is used to inject the query
  parameters from the request. */
  @Get()
  async getAlltickets(@Res() res: Response, @Query() query: any) {
    const tickets = await this.ticketsService.getTickets(query);
    if (tickets.length > 0) {
      res.status(HttpStatus.OK).json(tickets);
    } else {
      res.status(HttpStatus.NOT_FOUND).json([]);
    }
  }

  /* This is a method in the `TicketsController` class that handles a GET request to retrieve a single
  ticket by its ID. It uses the `@Get(':id')` decorator to specify the endpoint for the request,
  where `:id` is a dynamic parameter that will be replaced with the actual ID of the ticket. The
  `@Res()` decorator is used to inject the `Response` object from the `express` library, which is
  used to send the response back to the client. The `@Param('id')` decorator is used to inject the
  ID parameter from the request, and the `@Query()` decorator is used to inject any query parameters
  from the request. */
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

  /* This is a method in the `TicketsController` class that handles a GET request to retrieve a single
  ticket by its `ticket_id`. It uses the `@Get('id/:id')` decorator to specify the endpoint for the
  request, where `:id` is a dynamic parameter that will be replaced with the actual `ticket_id` of
  the ticket. The `@Res()` decorator is used to inject the `Response` object from the `express`
  library, which is used to send the response back to the client. The `@Param('id')` decorator is
  used to inject the `ticket_id` parameter from the request. The method then calls the
  `getOneTicket()` method of the `TicketsService` class to retrieve the ticket with the specified
  `ticket_id`. If the ticket is found, it is returned in the response with a status code of
  `HttpStatus.OK`. If the ticket is not found, a `HttpStatus.NOT_FOUND` status code is returned with
  an error message. */
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

  /* This is a method in the `TicketsController` class that handles a PUT request to update a ticket by
  its ID. It uses the `@Put(':id')` decorator to specify the endpoint for the request, where `:id`
  is a dynamic parameter that will be replaced with the actual ID of the ticket. The `@Res()`
  decorator is used to inject the `Response` object from the `express` library, which is used to
  send the response back to the client. The `@Body()` decorator is used to inject the request body,
  which contains the updated ticket data in the form of an `UpdateTicketDto` object. The
  `@Param('id')` decorator is used to inject the ID parameter from the request. The method then
  calls the `updateTicket()` method of the `TicketsService` class to update the ticket with the
  specified ID using the provided data. If the ticket is updated successfully, it is returned in the
  response with a status code of `HttpStatus.OK`. If the ticket is not found, a
  `HttpStatus.NOT_FOUND` status code is returned with an error message. */
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
