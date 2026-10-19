import { Module } from '@nestjs/common';
import { WhatCanDoService } from './what-can-do.service';
import { WhatCanDoController } from './what-can-do.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatCanDo } from './entities/what-can-do.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhatCanDo])],
  controllers: [WhatCanDoController],
  providers: [WhatCanDoService],
  exports: [WhatCanDoService],
})
export class WhatCanDoModule { }
