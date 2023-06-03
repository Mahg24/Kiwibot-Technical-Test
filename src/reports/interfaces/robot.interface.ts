import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
  ValidateNested,
} from 'class-validator';
const status = ['available', 'busy', 'reserved'] as const;
class Location {
  @IsLatitude()
  lat: number;
  @IsLongitude()
  lon: number;
}

export class HeartBeatDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  bot_id: string;

  @IsNotEmpty()
  @IsISO8601()
  timestamp: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsNotEmpty()
  @IsString()
  @IsIn(status)
  status: string;

  @IsNumber()
  @Min(0.1)
  @Max(100.0)
  @IsNotEmpty()
  battery_level: number;

  @IsNotEmpty()
  @IsString()
  software_version: string;

  @IsNotEmpty()
  @IsString()
  hardware_version: string;
}
