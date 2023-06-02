import { IsAlphanumeric, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  bot_id: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

const status = ['open', 'in progress', 'closed'] as const;
export class UpdateTicketDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(status)
  status: string;
}
