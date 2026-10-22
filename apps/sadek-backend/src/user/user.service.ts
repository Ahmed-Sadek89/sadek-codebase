import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateDefaultViewDto } from './dto/update-default-view.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from "bcrypt";
import { paginate } from '../common/pagination';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { confirmPassword, ...others } = createUserDto
      const newUser = this.userRepo.create(others);
      await this.userRepo.save(newUser)

      return {
        message: "User created successfully",
      }
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(query: FilterUserDto) {
    const filters: FindOptionsWhere<User> = {};

    if (query.avatarUrl) {
      filters.avatarUrl = query.avatarUrl;
    }

    if (query.isDefaultView !== undefined) {
      filters.isDefaultView = query.isDefaultView;
    }

    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = query.search
      ? [
        { ...filters, username: ILike(`%${query.search}%`) },
        { ...filters, email: ILike(`%${query.search}%`) },
      ]
      : filters;

    return paginate({
      repository: this.userRepo,
      where,
      page: query.page,
      limit: query.limit,
      order: query.order,
    });
  }

  async findOne(id: number) {
    const data = await this.userRepo.findOne({ where: { id } });
    if (!data) {
      throw new NotFoundException("User not found")
    }
    return data
  }


  async findOneByEmail(email: string) {
    const data = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        username: true, 
        email: true,
        password: true,
        avatarUrl: true,
        isDefaultView: true
      }
    });
    return data
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      console.log({ userUpdated: user })
      if (!user) {
        throw new NotFoundException("User not found")
      }
      const { confirmPassword, password, ...others } = updateUserDto
      await this.userRepo.update(id, others);
      return {
        message: "User updated successfully",
      }
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async updateDefaultView(id: number, { isDefaultView }: UpdateDefaultViewDto) {
    await this.findOne(id);
    if (isDefaultView) {
      const currentDefault = await this.userRepo.findOne({ where: { isDefaultView: true } });
      if (currentDefault) {
        await this.userRepo.update(currentDefault.id, { isDefaultView: false });
      }
    }
    await this.userRepo.update(id, { isDefaultView });
    return {
      message: "User default view updated successfully",
    }
  }

  async remove(id: number) {
    try {
      await this.userRepo.delete(id);
      return {
        message: "User deleted successfully",
      }
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.findOneByEmail(loginDto.email)
      if (!user) {
        throw new UnauthorizedException("Invalid email or password")
      }
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password || "");
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password");
      }
      await this.userRepo.update(user.id, { lastLoginAt: new Date() });
      return user
    } catch (error: any) {
      throw new BadRequestException(error.message)
    }
  }

  async updatePassword(id: number, hashedPassword: string) {
    await this.userRepo.update(id, { password: hashedPassword });
    return { message: "Password updated successfully" };
  }

  async logout(id: number) {
    await this.userRepo.update(id, { lastLogoutAt: new Date() });
    return { message: "Logout successfully" };
  }
}
