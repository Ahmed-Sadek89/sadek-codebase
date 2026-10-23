import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    email!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    subject!: string;

    @Column({ type: 'text', nullable: false })
    message!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    // The portfolio owner who received the message (the default-view user at send time).
    @ManyToOne(
        () => User,
        (user) => user.contacts,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;
}
