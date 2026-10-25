import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SEARCH_MAX } from '../../common/pagination.constants';

export class FilterUserInfoDto extends PaginationQueryDto {
  /** Case-insensitive match on the English or Arabic headTitle or shortDescription. */
  @IsString()
  @IsOptional()
  @MaxLength(SEARCH_MAX, {
    message: `search must be at most ${SEARCH_MAX} characters long`,
  })
  search?: string;
}
