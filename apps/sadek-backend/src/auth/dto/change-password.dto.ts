import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsEqualTo } from "../../../lib/validations/is-equal.validate";

export class ChangePasswordDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;

    @IsString({
        message: 'New Password is required',
    })
    @MinLength(8, {
        message: 'New Password must be at least 8 characters long',
    })
    @MaxLength(32, {
        message: 'New Password must be at most 32 characters long',
    })
    @Matches(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
        message: 'New Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    })
    newPassword!: string;

    @IsEqualTo('newPassword', {
        message: 'Confirm password must match password',
    })
    confirmPassword!: string;
}
