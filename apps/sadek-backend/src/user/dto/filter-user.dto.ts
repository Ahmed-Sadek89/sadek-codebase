import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';
import { SEARCH_MAX } from '../../common/pagination.constants';

export class FilterUserDto extends PaginationQueryDto {

    @IsString()
    @IsOptional()
    @MaxLength(SEARCH_MAX, {
        message: `search must be at most ${SEARCH_MAX} characters long`,
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
