import { CategoryProject } from '../../category-projects/entities/category-project.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { PROJECT_NAME_MAX, PROJECT_SHORT_DESCRIPTION_MAX } from '@repo/constants/projects';
import { URL_MAX } from '@repo/constants/url';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: PROJECT_NAME_MAX, nullable: false })
    nameAr!: string;

    @Column({ type: 'varchar', length: PROJECT_NAME_MAX, nullable: false })
    nameEn!: string;

    // Default '' only so rows saved before this column can be migrated; the DTO requires it.
    @Column({ type: 'varchar', length: PROJECT_SHORT_DESCRIPTION_MAX, nullable: false, default: '' })
    shortDescriptionAr!: string;

    @Column({ type: 'varchar', length: PROJECT_SHORT_DESCRIPTION_MAX, nullable: false, default: '' })
    shortDescriptionEn!: string;

    // Sanitized HTML (rich text); rows saved earlier may hold plain text.
    @Column({ type: 'text', nullable: false })
    descriptionAr!: string;

    @Column({ type: 'text', nullable: false })
    descriptionEn!: string;

    @Column({ type: 'boolean', nullable: false })
    isActive!: boolean;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    mainImageUrl?: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    liveUrl?: string;

    @Column({ type: 'varchar', length: URL_MAX, nullable: true })
    repoUrl?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    // make 1:m relation with project images

    @ManyToOne(
        () => User,
        (user) => user.projects,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;

    @ManyToMany(
        () => CategoryProject,
        (categoryProject) => categoryProject.projects,
        { cascade: false }
    )
    @JoinTable({
        name: 'project_category_projects',
        joinColumn: {
            name: 'project_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_project_id',
            referencedColumnName: 'id',
        },
    })
    categoryProjects!: CategoryProject[];
}
