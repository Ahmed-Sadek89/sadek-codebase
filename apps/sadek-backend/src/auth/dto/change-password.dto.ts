import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsEqualTo } from "../../../lib/validations/is-equal.validate";
import { PASSWORD_MAX, PASSWORD_MIN, PASSWORD_PATTERN } from '@repo/constants/auth';

export class ChangePasswordDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString({
        message: 'New Password is required',
    })
    @MinLength(PASSWORD_MIN, {
        message: `New Password must be at least ${PASSWORD_MIN} characters long`,
    })
    @MaxLength(PASSWORD_MAX, {
        message: `New Password must be at most ${PASSWORD_MAX} characters long`,
    })
    @Matches(PASSWORD_PATTERN, {
        message: 'New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    })
    newPassword!: string;

    @IsEqualTo('newPassword', {
        message: 'Confirm password must match password',
    })
    confirmPassword!: string;
}
