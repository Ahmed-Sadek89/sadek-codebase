import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorySkillDto } from './create-category_skill.dto';

export class UpdateCategorySkillDto extends PartialType(CreateCategorySkillDto) {}
