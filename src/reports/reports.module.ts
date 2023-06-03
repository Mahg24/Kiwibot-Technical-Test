import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './reports.shecma';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { RobotsGateway } from './robots.gateway';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    OpenAiModule,
    TicketsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, RobotsGateway],
})
export class ReportsModule {}
