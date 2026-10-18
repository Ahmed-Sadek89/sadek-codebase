import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_info')
export class UserInfo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    headTitle!: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    shortDescription!: string;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'int', nullable: false })
    yearsOfExp!: number;

    @Column({ type: 'int', nullable: false })
    companies!: number;

    @Column({ type: 'int', nullable: false })
    projectNumbers!: number;

    @Column({ type: 'int', nullable: false })
    techMastering!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    gmail!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    linkedin!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    github!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cv!: string;
}
