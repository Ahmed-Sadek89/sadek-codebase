import { IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, validate } from 'class-validator';
import { IsEqualTo } from '../../../lib/validations/is-equal.validate';
import {
    PASSWORD_MAX,
    PASSWORD_MIN,
    PASSWORD_PATTERN,
    USER_EMAIL_MAX,
    USERNAME_MAX,
    USERNAME_MIN,
} from '@repo/constants/auth';
import { URL_MAX } from '@repo/constants/url';
import { URL_OPTIONS } from '../../common/validation/url-options';
export class CreateUserDto {
    @IsString({
        message: 'Username is required',
    })
    @MinLength(USERNAME_MIN, {
        message: `Username must be at least ${USERNAME_MIN} characters long`,
    })
    @MaxLength(USERNAME_MAX, {
        message: `Username must be at most ${USERNAME_MAX} characters long`,
    })
    username!: string;

    @IsEmail()
    @MaxLength(USER_EMAIL_MAX)
    email!: string;

    @IsString({
        message: 'Password is required',
    })
    @MinLength(PASSWORD_MIN, {
        message: `Password must be at least ${PASSWORD_MIN} characters long`,
    })
    @MaxLength(PASSWORD_MAX, {
        message: `Password must be at most ${PASSWORD_MAX} characters long`,
    })
    @Matches(PASSWORD_PATTERN, {
        message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    })
    password!: string;

    @IsEqualTo('password', {
        message: 'Confirm password must match password',
    })
    confirmPassword!: string;

    @IsString()
    @IsOptional()
    @IsUrl(URL_OPTIONS)
    @MaxLength(URL_MAX)
    avatarUrl!: string;

    @IsString()
    @IsOptional()
    @IsUrl(URL_OPTIONS)
    @MaxLength(URL_MAX)
    coverPhotoUrl!: string;
}

// let user = new CreateUserDto();
// user.username = 'johndoe';
// user.email = 'test@test.com';
// user.password = 'Ahmed@01212758221';
// user.confirmPassword = 'Ahmed@01212758221';
// validate(user).then(errors => {
//     if (errors.length > 0) {
//         console.log(errors);
//     } else {
//         console.log('No errors');
//     }
// });