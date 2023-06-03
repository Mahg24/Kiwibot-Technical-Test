import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
  @Prop()
  username: string;
  @Prop()
  message: string;
  @Prop()
  bot_id: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'tickets' })
  ticket: string;
  @Prop()
  botHeartbeat: mongoose.Schema.Types.Mixed;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
