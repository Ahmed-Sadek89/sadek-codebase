import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    headTitle!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    shortDescription!: string;

    @Column({ type: 'text', nullable: false })
    description!: string;

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
