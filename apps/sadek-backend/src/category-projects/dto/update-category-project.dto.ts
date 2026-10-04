import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryProjectDto } from './create-category-project.dto';

export class UpdateCategoryProjectDto extends PartialType(CreateCategoryProjectDto) {}
