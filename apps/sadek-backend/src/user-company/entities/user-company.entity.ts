import {
    DEFAULT_EMPLOYMENT_TYPE,
    DEFAULT_LOCATION_TYPE,
    EmploymentType,
    LocationType,
    USER_COMPANY_JOB_TITLE_MAX,
    USER_COMPANY_LOCATION_MAX,
    USER_COMPANY_NAME_MAX,
} from '@repo/constants/user-company';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { URL_MAX } from '@repo/constants/url';

@Entity('user_company')
export class UserCompany {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: USER_COMPANY_NAME_MAX, nullable: false })
    company_name!: string;

    @Column({ type: 'text', nullable: true })
    description_en!: string;

    @Column({ type: 'text', nullable: true })
    description_ar!: string;

    @Column({ type: 'timestamp', nullable: false })
    startWorkFrom!: Date;

    @Column({ type: 'timestamp', nullable: true })
    startWorkTo!: Date;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    logo!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    company_site!: string;

    // The defaults only fill rows saved before these columns existed; the DTO requires all four.
    @Column({ type: 'varchar', length: USER_COMPANY_JOB_TITLE_MAX, default: '', nullable: false })
    job_title!: string;

    @Column({ type: 'varchar', length: USER_COMPANY_LOCATION_MAX, default: '', nullable: false })
    location!: string;

    // Shared with the dashboard and web app (@repo/constants/user-company).
    @Column({ type: 'enum', enum: LocationType, default: DEFAULT_LOCATION_TYPE, nullable: false })
    location_type!: LocationType;

    @Column({ type: 'enum', enum: EmploymentType, default: DEFAULT_EMPLOYMENT_TYPE, nullable: false })
    employment_type!: EmploymentType;

    @Column({ type: 'boolean', default: true, nullable: false })
    isActive!: boolean;

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
