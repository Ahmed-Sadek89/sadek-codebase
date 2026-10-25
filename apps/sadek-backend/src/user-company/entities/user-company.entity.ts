import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('user_company')
export class UserCompany {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    company_name!: string;

    @Column({ type: 'text', nullable: true })
    description_en!: string;

    @Column({ type: 'text', nullable: true })
    description_ar!: string;

    @Column({ type: 'timestamp', nullable: false })
    startWorkFrom!: Date;

    @Column({ type: 'timestamp', nullable: true })
    startWorkTo!: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    logo!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    company_site!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.userCompanies,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;
}
