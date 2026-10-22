import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FilterUserInfoDto extends PaginationQueryDto {
  /** Case-insensitive match on the English or Arabic headTitle or shortDescription. */
  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'search be at most 20 characters long',
  })
  search?: string;
}
