import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    headTitle_en!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    headTitle_ar!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    shortDescription_en!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
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

    @Column({ type: 'varchar', length: 255, nullable: true })
    gmail!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    linkedin!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    github!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
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
