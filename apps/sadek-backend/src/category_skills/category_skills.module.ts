import { Module, forwardRef } from '@nestjs/common';
import { CategorySkillsService } from './category_skills.service';
import { CategorySkillsController } from './category_skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySkill } from './entities/category_skill.entity';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategorySkill]),
    forwardRef(() => SkillsModule),
  ],
  controllers: [CategorySkillsController],
  providers: [CategorySkillsService],
  exports: [CategorySkillsService],
})
export class CategorySkillsModule {}
