import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
    CONTACT_EMAIL_MAX,
    CONTACT_MESSAGE_MAX,
    CONTACT_NAME_MAX,
    CONTACT_SUBJECT_MAX,
} from '@repo/constants/contacts';

export class CreateContactDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(CONTACT_NAME_MAX)
    name!: string;

    @IsEmail()
    @MaxLength(CONTACT_EMAIL_MAX)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONTACT_SUBJECT_MAX)
    subject!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(CONTACT_MESSAGE_MAX)
    message!: string;
}
