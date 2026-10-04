import {
    IsEmail,
    IsNumber,
    IsObject,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
    @IsNumber()
    userId!: number;

    @IsEmail()
    email!: string;
}

export class RequestUserDto {
    @IsObject()
    @ValidateNested()
    @Type(() => UserDto)
    user!: UserDto;
}