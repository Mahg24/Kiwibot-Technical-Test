import { Injectable } from '@nestjs/common';
import { Ticket } from './tickets.shecma';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto, UpdateTicketDto } from './interfaces/ticket.dto';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

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

  async updateTicket(id: string, reportStatus: UpdateTicketDto) {
    const ticket = await this.ticketModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          status: reportStatus.status,
        },
      },
      { new: true },
    );
    if (ticket) {
      return ticket;
    } else {
      return null;
    }
  }

  async getTickets(query) {
    return await this.ticketModel.find(query);
  }

  async getOneTicket(query) {
    return await this.ticketModel.findOne(query);
  }
}
