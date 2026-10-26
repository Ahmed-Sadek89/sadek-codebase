import { PartialType } from '@nestjs/swagger';
import { CreateInstructorExperienceDto } from './create-instructor-experience.dto';

export class UpdateInstructorExperienceDto extends PartialType(CreateInstructorExperienceDto) {}
