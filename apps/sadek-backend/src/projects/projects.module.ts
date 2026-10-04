import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CategoryProjectsModule } from '../category-projects/category-projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => CategoryProjectsModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})
export class ProjectsModule { }
