import { PartialType } from '@nestjs/swagger';
import { CreateCategorySkillDto } from './create-category_skill.dto';

export class UpdateCategorySkillDto extends PartialType(CreateCategorySkillDto) {}
