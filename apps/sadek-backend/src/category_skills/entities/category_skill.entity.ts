import { User } from "../../user/entities/user.entity";
import { Skill } from "../../skills/entities/skill.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";

@Entity("category_skills")
export class CategorySkill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  nameAr!: string;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  nameEn!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  descriptionAr!: string;

  @Column({
    type: "text",
    nullable: true,
  })
  descriptionEn!: string;

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  isActive!: boolean;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @ManyToOne(
    () => User,
    (user) => user.categorySkills,
    {
      nullable: false,
      onDelete: "CASCADE"
    }
  )
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToMany(() => Skill, (skill) => skill.categorySkills, { cascade: false })
  skills!: Skill[];
}
