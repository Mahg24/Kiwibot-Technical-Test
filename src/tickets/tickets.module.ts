import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './tickets.shecma';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [
    OpenAiModule,
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
