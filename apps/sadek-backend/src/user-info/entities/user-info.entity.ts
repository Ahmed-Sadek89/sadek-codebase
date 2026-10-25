import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PHONE_MAX, USER_INFO_HEAD_TITLE_MAX, USER_INFO_SHORT_DESCRIPTION_MAX } from '@repo/constants/user-info';
import { URL_MAX } from '@repo/constants/url';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: USER_INFO_HEAD_TITLE_MAX, nullable: false })
    headTitle_en!: string;

    @Column({ type: 'varchar', length: USER_INFO_HEAD_TITLE_MAX, nullable: true })
    headTitle_ar!: string;

    @Column({ type: 'varchar', length: USER_INFO_SHORT_DESCRIPTION_MAX, nullable: false })
    shortDescription_en!: string;

    @Column({ type: 'varchar', length: USER_INFO_SHORT_DESCRIPTION_MAX, nullable: true })
    shortDescription_ar!: string;

    @Column({ type: 'text', nullable: false })
    description_en!: string;

    @Column({ type: 'text', nullable: true })
    description_ar!: string;

    @Column({ type: 'int', nullable: false })
    yearsOfExp!: number;

    @Column({ type: 'int', nullable: false })
    companies!: number;

    @Column({ type: 'int', nullable: false })
    projectNumbers!: number;

    @Column({ type: 'int', nullable: false })
    techMastering!: number;

    // Required by the DTO; the '' default only fills rows saved before these columns existed.
    @Column({ type: 'varchar', length: PHONE_MAX, nullable: false, default: '' })
    phoneNumber!: string;

    @Column({ type: 'varchar', length: PHONE_MAX, nullable: false, default: '' })
    whatsappNumber!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    gmail!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    linkedin!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    github!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    cv!: string;
    
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    createdAt!: Date;
    // Owning side: adds a unique `userId` FK, so each user has at most one row.
    @OneToOne(
        () => User,
        (user) => user.userInfo,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn()
    user!: User;
}
