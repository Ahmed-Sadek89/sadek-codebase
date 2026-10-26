import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { CategorySkill } from '../../category_skills/entities/category_skill.entity';
import { User } from '../../user/entities/user.entity';
import { InstructorExperience } from '../../instructor-experience/entities/instructor-experience.entity';
import { SKILL_NAME_MAX } from '@repo/constants/skills';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        length: SKILL_NAME_MAX,
        nullable: false,
    })
    name!: string;

    @Column({
        type: 'boolean',
        default: true,
        nullable: false,
    })
    isActive!: boolean;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: false,
    })
    createdAt!: Date;


    @ManyToOne(
        () => User,
        (user) => user.skills,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;


    @ManyToMany(
        () => CategorySkill,
        (categorySkill) => categorySkill.skills,
        { cascade: false }
    )
    @JoinTable({
        name: 'skill_category_skills',
        joinColumn: {
            name: 'skill_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_skill_id',
            referencedColumnName: 'id',
        },
    })
    categorySkills!: CategorySkill[];

    @ManyToMany(
        () => InstructorExperience,
        (instructorExperience) => instructorExperience.skills,
    )
    instructorExperiences!: InstructorExperience[];
}
