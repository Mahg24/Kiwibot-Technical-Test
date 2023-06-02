import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './reports.shecma';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from 'src/open-ai/open-ai.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    OpenAiModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
