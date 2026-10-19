import { PartialType } from '@nestjs/swagger';
import { CreateWhatCanDoDto } from './create-what-can-do.dto';

export class UpdateWhatCanDoDto extends PartialType(CreateWhatCanDoDto) {}
