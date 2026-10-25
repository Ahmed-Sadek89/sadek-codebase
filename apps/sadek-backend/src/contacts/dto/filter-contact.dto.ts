import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SEARCH_MAX } from '../../common/pagination.constants';

export class FilterContactDto extends PaginationQueryDto {
  /** Case-insensitive match on the name, email, subject or message. */
  @IsString()
  @IsOptional()
  @MaxLength(SEARCH_MAX, {
    message: `search must be at most ${SEARCH_MAX} characters long`,
  })
  search?: string;
}
