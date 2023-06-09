import { Injectable } from '@nestjs/common';
import { Ticket } from './tickets.shecma';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto, UpdateTicketDto } from './interfaces/ticket.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { TicketsGateway } from './tickets.gateway';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private ticketsGateway: TicketsGateway,
  ) {}

  /**
   * This function creates a new ticket with the provided data and saves it to the database.
   * @param {CreateTicketDto} reportData - CreateTicketDto, which is a data transfer object containing
   * information about a ticket to be created. It includes the problem location, problem type, summary,
   * bot ID, and other relevant information. The function creates a new ticket using this information
   * and saves it to the database.
   * @returns the result of the `ticket.save()` method call, which is a Promise that resolves to the
   * newly created ticket object. The `await` keyword is used to wait for the Promise to resolve before
   * returning the result.
   */
  async createTicket(reportData: CreateTicketDto) {
    const ticket = new this.ticketModel({
      ticket_id: `${randomUUID().toString()}-${reportData.bot_id}`,
      problem_location: reportData.problem_location,
      problem_type: reportData.problem_type,
      summary: reportData.summary,
      bot_id: reportData.bot_id,
      status: 'open',
    });
    return await ticket.save();
  }

  /**
   * This is an async function that updates the status of a ticket and returns the updated ticket if
   * successful, otherwise it returns null.
   * @param {string} id - A string representing the ID of the ticket to be updated.
   * @param {UpdateTicketDto} ticketStatus - UpdateTicketDto is likely a custom data transfer object
   * (DTO) that contains information about the updated status of a ticket. It probably has at least one
   * property called "status" that indicates the new status of the ticket.
   * @returns The `updateTicket` function returns either the updated ticket object or `null` if the
   * ticket was not found.
   */
  async updateTicket(id: string, ticketStatus: UpdateTicketDto) {
    const ticket = await this.ticketModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: ticketStatus.status,
        },
      },
      { new: true },
    );
    if (ticket) {
      this.ticketsGateway.ticketStatusChange(id, ticketStatus.status);
      return ticket;
    } else {
      return null;
    }
  }

  /**
   * This function retrieves tickets from a database based on a given query.
   * @param query - The query parameter is an object that specifies the conditions that the MongoDB
   * database will use to filter the results of the find operation. It can include properties such as
   * field values, comparison operators, logical operators, and regular expressions. The find method
   * will return all documents that match the specified query.
   * @returns This function is returning a promise that resolves to an array of ticket objects that
   * match the given query. The `await` keyword is used to wait for the `find()` method of the
   * `ticketModel` to complete before returning the result.
   */
  async getTickets(query) {
    return await this.ticketModel.find(query);
  }

  /**
   * This function retrieves one ticket from a database based on a given query.
   * @param query - The query parameter is an object that specifies the search criteria for the ticket
   * to be retrieved from the database. It is used as an argument for the findOne method of the
   * ticketModel. The findOne method returns the first document that matches the specified query
   * criteria.
   * @returns This function is returning a promise that resolves to the result of a MongoDB findOne
   * query on the ticketModel collection with the provided query parameter.
   */
  async getOneTicket(query) {
    return await this.ticketModel.findOne(query);
  }
}
