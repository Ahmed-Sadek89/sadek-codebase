import { Project } from '../../projects/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { CATEGORY_PROJECT_NAME_MAX } from '@repo/constants/category-projects';

@Entity('category_projects')
export class CategoryProject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: CATEGORY_PROJECT_NAME_MAX, nullable: false })
    nameAr!: string;

    @Column({ type: 'varchar', length: CATEGORY_PROJECT_NAME_MAX, nullable: false })
    nameEn!: string;

    @Column({ type: 'text', nullable: true })
    descriptionAr!: string;

    @Column({ type: 'text', nullable: true })
    descriptionEn!: string;

    @Column({ type: 'boolean', nullable: false })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.categoryProjects,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;

    @ManyToMany(
        () => Project,
        (project) => project.categoryProjects,
        { cascade: false }
    )
    projects!: Project[];

}
