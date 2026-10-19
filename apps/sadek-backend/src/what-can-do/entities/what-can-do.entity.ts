import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('what_can_do')
export class WhatCanDo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    title_en!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    title_ar!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    shortDescription_en!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    shortDescription_ar!: string;

    @Column({ type: 'text', nullable: true })
    description_en!: string;

    @Column({ type: 'text', nullable: true })
    description_ar!: string;

    // Display order, set by the client on create and editable on update.
    @Column({ type: 'int', nullable: false })
    rank!: number;

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
