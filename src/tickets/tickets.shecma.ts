import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({
    unique: true,
  })
  ticket_id: string;
  @Prop()
  problem_location: string;
  @Prop()
  problem_type: string;
  @Prop()
  summary: string;
  @Prop()
  bot_id: string;
  @Prop()
  status: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
