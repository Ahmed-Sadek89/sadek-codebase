import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { CategorySkill } from '../../category_skills/entities/category_skill.entity';
import { User } from '../../user/entities/user.entity';

@Entity('skills')
export class Skill {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'varchar',
        length: 50,
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
}
