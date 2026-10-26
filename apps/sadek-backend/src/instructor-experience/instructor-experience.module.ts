import { Module } from '@nestjs/common';
import { InstructorExperienceService } from './instructor-experience.service';
import { InstructorExperienceController } from './instructor-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstructorExperience } from './entities/instructor-experience.entity';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [TypeOrmModule.forFeature([InstructorExperience]), SkillsModule],
  controllers: [InstructorExperienceController],
  providers: [InstructorExperienceService],
  exports: [InstructorExperienceService],
})
export class InstructorExperienceModule { }
