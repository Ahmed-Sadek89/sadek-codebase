import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FilterContactDto extends PaginationQueryDto {
  /** Case-insensitive match on the name, email, subject or message. */
  @IsString()
  @IsOptional()
  @MaxLength(50, {
    message: 'search be at most 50 characters long',
  })
  search?: string;
}
