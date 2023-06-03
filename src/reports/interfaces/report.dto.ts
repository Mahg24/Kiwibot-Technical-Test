import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
