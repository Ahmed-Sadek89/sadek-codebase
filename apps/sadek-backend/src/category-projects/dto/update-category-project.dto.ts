import { PartialType } from '@nestjs/swagger';
import { CreateCategoryProjectDto } from './create-category-project.dto';

export class UpdateCategoryProjectDto extends PartialType(CreateCategoryProjectDto) {}
