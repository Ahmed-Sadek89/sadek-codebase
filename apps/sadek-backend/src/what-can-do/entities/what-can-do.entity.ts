import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { WHAT_CAN_DO_SHORT_DESCRIPTION_MAX, WHAT_CAN_DO_TITLE_MAX } from '@repo/constants/what-can-do';

@Entity('what_can_do')
export class WhatCanDo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: WHAT_CAN_DO_TITLE_MAX, nullable: false })
    title_en!: string;

    @Column({ type: 'varchar', length: WHAT_CAN_DO_TITLE_MAX, nullable: true })
    title_ar!: string;

    @Column({ type: 'varchar', length: WHAT_CAN_DO_SHORT_DESCRIPTION_MAX, nullable: true })
    shortDescription_en!: string;

    @Column({ type: 'varchar', length: WHAT_CAN_DO_SHORT_DESCRIPTION_MAX, nullable: true })
    shortDescription_ar!: string;

    @Column({ type: 'text', nullable: true })
    description_en!: string;

    @Column({ type: 'text', nullable: true })
    description_ar!: string;

    // Display order, set by the client on create and editable on update.
    @Column({ type: 'int', nullable: false })
    rank!: number;

    @Column({ type: 'boolean', default: true, nullable: false })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.whatCanDos,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;
}
