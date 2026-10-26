import bcrypt from "bcrypt";
import { CategoryProject } from "../../category-projects/entities/category-project.entity";
import { CategorySkill } from "../../category_skills/entities/category_skill.entity";
import { Project } from "../../projects/entities/project.entity";
import { Skill } from "../../skills/entities/skill.entity";
import { UserInfo } from "../../user-info/entities/user-info.entity";
import { UserCompany } from "../../user-company/entities/user-company.entity";
import { WhatCanDo } from "../../what-can-do/entities/what-can-do.entity";
import { Contact } from "../../contacts/entities/contact.entity";
import { Seo } from "../../seo/entities/seo.entity";
import { Page } from "../../pages/entities/page.entity";
import { InstructorExperience } from "../../instructor-experience/entities/instructor-experience.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { USER_EMAIL_MAX, USERNAME_MAX } from "@repo/constants/auth";
import { URL_MAX } from "@repo/constants/url";

// Partial unique index: at most one user can be the default view.
@Index("UQ_users_is_default_view", ["isDefaultView"], { unique: true, where: '"isDefaultView" = true' })
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
        length: USERNAME_MAX
    })
    username!: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length: USER_EMAIL_MAX
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
        length: URL_MAX,
        nullable: true,
    })
    avatarUrl!: string

    @Column({
        type: "varchar",
        length: URL_MAX,
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

    @Column({
        type: "boolean",
        default: false,
        nullable: false,
    })
    isDefaultView!: boolean;

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

    @OneToMany(
        () => WhatCanDo,
        (whatCanDo) => whatCanDo.user
    )
    whatCanDos!: WhatCanDo[];

    @OneToMany(
        () => Contact,
        (contact) => contact.user
    )
    contacts!: Contact[];

    @OneToMany(
        () => Seo,
        (seo) => seo.user
    )
    seos!: Seo[];

    @OneToMany(
        () => Page,
        (page) => page.user
    )
    pages!: Page[];

    @OneToMany(
        () => InstructorExperience,
        (instructorExperience) => instructorExperience.user
    )
    instructorExperiences!: InstructorExperience[];
}
