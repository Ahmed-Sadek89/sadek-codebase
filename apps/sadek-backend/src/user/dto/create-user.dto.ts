import { IsEmail, IsInt, IsOptional, IsString, IsUrl, Matches, Max, MaxLength, Min, MinLength, validate } from 'class-validator';
import { IsEqualTo } from '../../../lib/validations/is-equal.validate';
export class CreateUserDto {
    @IsString()
    @IsOptional()
    @MinLength(3, {
        message: 'First name must be at least 3 characters long',
    })
    @MaxLength(20, {
        message: 'First name must be at most 20 characters long',
    })
    firstName!: string;

    @IsString()
    @IsOptional()
    @MinLength(3, {
        message: 'Last name must be at least 3 characters long',
    })
    @MaxLength(20, {
        message: 'Last name must be at most 20 characters long',
    })
    lastName!: string;

    @IsInt({
        message: 'Age must be an integer',
    })
    @Min(0, {
        message: 'Age must be at least 0',
    })
    @Max(150, {
        message: 'Age must be at most 150',
    })
    age!: number

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
}

// let user = new CreateUserDto();
// user.firstName = 'John';
// user.lastName = 'Doe';
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