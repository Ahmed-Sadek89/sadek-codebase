import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ToBoolean } from '../../common/transformers/to-boolean';

export class FilterSkillDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(20, {
    message: 'search be at most 20 characters long',
  })
  search?: string;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  categoryId?: number
}
