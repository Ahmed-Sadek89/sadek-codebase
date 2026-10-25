import { Project } from '../../projects/entities/project.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { CATEGORY_PROJECT_NAME_MAX, CATEGORY_PROJECT_RANK_MIN } from '@repo/constants/category-projects';

@Entity('category_projects')
export class CategoryProject {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: CATEGORY_PROJECT_NAME_MAX, nullable: false })
    nameAr!: string;

    @Column({ type: 'varchar', length: CATEGORY_PROJECT_NAME_MAX, nullable: false })
    nameEn!: string;

    // Display order on the website: lowest rank first.
    @Column({ type: 'int', default: CATEGORY_PROJECT_RANK_MIN, nullable: false })
    rank!: number;

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
