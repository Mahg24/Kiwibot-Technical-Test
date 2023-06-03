import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/config/configuration';
import { ReportsModule } from 'src/reports/reports.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
