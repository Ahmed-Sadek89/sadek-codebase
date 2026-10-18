import { IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength, validate } from 'class-validator';
import { IsEqualTo } from '../../../lib/validations/is-equal.validate';
export class CreateUserDto {
    @IsString({
        message: 'Username is required',
    })
    @MinLength(3, {
        message: 'Username must be at least 3 characters long',
    })
    @MaxLength(50, {
        message: 'Username must be at most 50 characters long',
    })
    username!: string;

    @IsEmail()
    email!: string;

    @IsString({
        message: 'Password is required',
    })
    @MinLength(8, {
        message: 'Password must be at least 8 characters long',
    })
    @MaxLength(32, {
        message: 'Password must be at most 32 characters long',
    })
    @Matches(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), {
        message: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    })
    password!: string;

    @IsEqualTo('password', {
        message: 'Confirm password must match password',
    })
    confirmPassword!: string;

    @IsString()
    @IsOptional()
    @IsUrl({
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true,
        require_valid_protocol: true,
    })
    avatarUrl!: string;

    @IsString()
    @IsOptional()
    @IsUrl({
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true,
        require_valid_protocol: true,
    })
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