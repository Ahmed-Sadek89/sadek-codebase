import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../lib/DBConfig';
import { AuthModule } from './auth/auth.module';
import { CategorySkillsModule } from './category_skills/category_skills.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { CategoryProjectsModule } from './category-projects/category-projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
    AuthModule,
    CategorySkillsModule,
    SkillsModule,
    ProjectsModule,
    CategoryProjectsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
