import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import { paginate } from '../common/pagination';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) { }

  /** Public: a visitor's message, addressed to the user whose `isDefaultView` is true. */
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const owner = await this.contactRepository.manager.findOne(User, {
      where: { isDefaultView: true },
      select: { id: true },
    });
    if (!owner) {
      throw new NotFoundException('No default-view user to receive the message');
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      user: { id: owner.id },
    });
    return await this.contactRepository.save(contact);
  }

  /**
   * The signed-in user's messages, paginated by `createdAt` (`order` ASC/DESC,
   * default DESC), optionally narrowed by `search`.
   */
  async findAll(query: FilterContactDto, userId: number) {
    return await paginate({
      repository: this.contactRepository,
      where: this.ownedWhere(userId, query.search),
      page: query.page,
      limit: query.limit,
      order: query.order,
    });
  }

  /** One of the user's messages; another user's id is "not found". */
  async findOne(id: number, userId: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!contact) {
      throw new NotFoundException(`Contact with id ${id} not found`);
    }
    return contact;
  }

  async remove(id: number, userId: number): Promise<void> {
    const contact = await this.findOne(id, userId);
    await this.contactRepository.remove(contact);
  }

  /** The user's messages, optionally narrowed by `search` on the name, email, subject or message. */
  private ownedWhere(userId: number, search?: string): FindOptionsWhere<Contact> | FindOptionsWhere<Contact>[] {
    const owner: FindOptionsWhere<Contact> = { user: { id: userId } };
    search = search?.trim();
    if (!search) return owner;
    return [
      { ...owner, name: ILike(`%${search}%`) },
      { ...owner, email: ILike(`%${search}%`) },
      { ...owner, subject: ILike(`%${search}%`) },
      { ...owner, message: ILike(`%${search}%`) },
    ];
  }
}
