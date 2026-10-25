import { Seo } from '../../seo/entities/seo.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { PAGE_NAME_MAX } from '@repo/constants/pages';

/** A website (apps/web) page, e.g. Home; each page has at most one SEO row. */
@Entity('pages')
export class Page {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: PAGE_NAME_MAX, nullable: false, unique: true })
    name_en!: string;

    @Column({ type: 'varchar', length: PAGE_NAME_MAX, nullable: false, unique: true })
    name_ar!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.pages,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    user!: User;

    // Seo owns the relation (seo.pageId).
    @OneToOne(
        () => Seo,
        (seo) => seo.page
    )
    seo!: Seo;
}
