import bcrypt from "bcrypt";
import { CategoryProject } from "../../category-projects/entities/category-project.entity";
import { CategorySkill } from "../../category_skills/entities/category_skill.entity";
import { Project } from "../../projects/entities/project.entity";
import { Skill } from "../../skills/entities/skill.entity";
import { UserInfo } from "../../user-info/entities/user-info.entity";
import { UserCompany } from "../../user-company/entities/user-company.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn({
        type: "integer"
    })
    id!: number;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length: 50
    })
    username!: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length: 70
    })
    email!: string

    @Column({
        type: "varchar",
        length: 200,
        select: false,
        nullable: false
    })
    password!: string;

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    avatarUrl!: string

    @Column({
        type: "varchar",
        length: 255,
        nullable: true,
    })
    coverPhotoUrl!: string

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
        nullable: false,
    })
    createdAt!: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    lastLoginAt!: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    lastLogoutAt!: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password || this.password.startsWith("$2")) return;
        this.password = await bcrypt.hash(this.password, 10);
    }

    @OneToMany(
        () => CategorySkill,
        (categorySkill) => categorySkill.user
    )
    categorySkills!: CategorySkill[];

    @OneToMany(
        () => Skill,
        (skill) => skill.user
    )
    skills!: Skill[];

    @OneToMany(
        () => CategoryProject,
        (categoryProject) => categoryProject.user
    )
    categoryProjects!: CategoryProject[];

    @OneToMany(
        () => Project,
        (project) => project.user
    )
    projects!: Project[];

    @OneToOne(
        () => UserInfo,
        (userInfo) => userInfo.user
    )
    userInfo!: UserInfo;

    @OneToMany(
        () => UserCompany,
        (userCompany) => userCompany.user
    )
    userCompanies!: UserCompany[];
}
