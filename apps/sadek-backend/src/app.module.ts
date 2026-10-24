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
import { UserInfoModule } from './user-info/user-info.module';
import { UserCompanyModule } from './user-company/user-company.module';
import { WhatCanDoModule } from './what-can-do/what-can-do.module';
import { ContactModule } from './contacts/contact.module';
import { SeoModule } from './seo/seo.module';
import { PagesModule } from './pages/pages.module';

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
    CategoryProjectsModule,
    UserInfoModule,
    UserCompanyModule,
    WhatCanDoModule,
    ContactModule,
    SeoModule,
    PagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
