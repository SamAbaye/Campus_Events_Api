import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { User, ROLES } from '../events.types.js';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    email: string

    

}