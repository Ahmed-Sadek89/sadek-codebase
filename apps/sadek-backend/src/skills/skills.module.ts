import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';
import { CategorySkillsModule } from '../category_skills/category_skills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill]),
    forwardRef(() => CategorySkillsModule),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
