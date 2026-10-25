import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { CONTACT_EMAIL_MAX, CONTACT_NAME_MAX, CONTACT_SUBJECT_MAX } from '@repo/constants/contacts';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: CONTACT_NAME_MAX, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: CONTACT_EMAIL_MAX, nullable: false })
    email!: string;

    @Column({ type: 'varchar', length: CONTACT_SUBJECT_MAX, nullable: false })
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
