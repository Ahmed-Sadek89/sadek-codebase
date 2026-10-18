import { Module } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { UserCompanyController } from './user-company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCompany } from './entities/user-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserCompany])],
  controllers: [UserCompanyController],
  providers: [UserCompanyService],
  exports: [UserCompanyService],
})
export class UserCompanyModule { }
