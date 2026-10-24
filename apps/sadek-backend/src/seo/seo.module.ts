import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seo } from './entities/seo.entity';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seo]), PagesModule],
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule { }
