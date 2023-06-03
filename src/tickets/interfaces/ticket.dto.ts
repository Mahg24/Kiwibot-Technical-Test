import { IsAlphanumeric, IsNotEmpty, IsString, IsIn } from 'class-validator';

const status = ['open', 'in progress', 'closed'] as const;
export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  problem_location: string;

  @IsString()
  problem_type: string;

  @IsString()
  summary: string;

  @IsString()
  bot_id: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(status)
  status: 'open';

  username?: string;
}

export class UpdateTicketDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(status)
  status: string;
}
