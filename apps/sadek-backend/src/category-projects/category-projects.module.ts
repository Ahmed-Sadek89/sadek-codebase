import { forwardRef, Module } from '@nestjs/common';
import { CategoryProjectsService } from './category-projects.service';
import { CategoryProjectsController } from './category-projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProject } from './entities/category-project.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryProject]),
    forwardRef(() => ProjectsModule),
  ],
  controllers: [CategoryProjectsController],
  providers: [CategoryProjectsService],
  exports: [CategoryProjectsService],
})
export class CategoryProjectsModule { }
