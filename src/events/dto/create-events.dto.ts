import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventStatuses } from '../events.types.js';
import type { EventStatus } from '../events.types.js';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @IsOptional()
  @IsIn(EventStatuses)
  status?: EventStatus;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
