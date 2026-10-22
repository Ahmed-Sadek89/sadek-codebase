import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';

export class FilterUserDto extends PaginationQueryDto {

    @IsString()
    @IsOptional()
    @MaxLength(20, {
        message: 'search be at most 20 characters long',
    })
    search!: string;

    @IsString()
    @IsOptional()
    avatarUrl!: string;

    @IsOptional()
    @ToBoolean()
    @IsBoolean()
    isDefaultView?: boolean;

}
