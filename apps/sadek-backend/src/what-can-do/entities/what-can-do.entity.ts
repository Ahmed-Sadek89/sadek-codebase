import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('what_can_do')
export class WhatCanDo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    title!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    shortDescription!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

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
