import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, Index } from 'typeorm';
import {
    INSTRUCTOR_EXPERIENCE_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_RANK_MIN,
} from '@repo/constants/instructor-experience';
import { URL_MAX } from '@repo/constants/url';

@Entity('instructor_experience')
export class InstructorExperience {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index('IDX_instructor_experience_name')
    @Column({ type: 'varchar', length: INSTRUCTOR_EXPERIENCE_NAME_MAX, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: false })
    courseLink!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    coverPhotoUrl?: string;

    // Sanitized HTML (rich text).
    @Column({ type: 'text', nullable: false })
    descriptionAr!: string;

    @Column({ type: 'text', nullable: false })
    descriptionEn!: string;

    @Column({ type: 'timestamp', nullable: false })
    startAt!: Date;

    @Column({ type: 'timestamp', nullable: false })
    endAt!: Date;

    @Column({ type: 'varchar', length: INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX, nullable: false })
    coursePlatformName!: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: false })
    coursePlatformUrl!: string;

    // Display order on the website: lowest rank first.
    @Column({ type: 'int', default: INSTRUCTOR_EXPERIENCE_RANK_MIN, nullable: false })
    rank!: number;

    @Column({ type: 'boolean', default: true, nullable: false })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.instructorExperiences,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;

    @ManyToMany(
        () => Skill,
        (skill) => skill.instructorExperiences,
        { cascade: false }
    )
    @JoinTable({
        name: 'instructor_experience_skills',
        joinColumn: {
            name: 'instructor_experience_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id',
        },
    })
    skills!: Skill[];
}
