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
import { CATEGORY_SKILL_NAME_MAX, CATEGORY_SKILL_RANK_MIN } from "@repo/constants/category-skills";

@Entity("category_skills")
export class CategorySkill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: CATEGORY_SKILL_NAME_MAX,
    nullable: false,
  })
  nameAr!: string;

  @Column({
    type: "varchar",
    length: CATEGORY_SKILL_NAME_MAX,
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

  // Display order on the website: lowest rank first.
  @Column({
    type: "int",
    default: CATEGORY_SKILL_RANK_MIN,
    nullable: false,
  })
  rank!: number;

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
