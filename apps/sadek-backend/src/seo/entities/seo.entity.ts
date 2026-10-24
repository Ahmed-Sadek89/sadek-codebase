import type { SeoHreflang } from '@repo/constants/hreflang';
import { DEFAULT_TWITTER_CARD, TwitterCard } from '@repo/constants/twitter-card';
import { Page } from '../../pages/entities/page.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

@Entity('seo')
export class Seo {
    @PrimaryGeneratedColumn()
    id!: number;

    // The page this SEO is for (pages.id). The one-to-one relation below makes
    // it unique: each page has at most one SEO row.
    @Column({ type: 'int', nullable: false })
    pageId!: number;

    @OneToOne(
        () => Page,
        (page) => page.seo,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn({ name: 'pageId' })
    page!: Page;

    @Column({ type: 'varchar', length: 70, nullable: false })
    metaTitle_en!: string;

    @Column({ type: 'varchar', length: 70, nullable: false })
    metaTitle_ar!: string;

    @Column({ type: 'varchar', length: 170, nullable: false })
    metaDescription_en!: string;

    @Column({ type: 'varchar', length: 170, nullable: false })
    metaDescription_ar!: string;

    // The page's preferred URL (<link rel="canonical">); null lets the website build it.
    @Column({ type: 'varchar', length: 255, nullable: true })
    canonicalUrl!: string | null;

    // Language alternates (<link rel="alternate" hreflang>), e.g. en, ar and x-default.
    @Column({ type: 'jsonb', nullable: false, default: () => "'[]'" })
    hreflang!: SeoHreflang[];

    @Column({ type: 'text', nullable: true })
    keywords_en!: string;

    @Column({ type: 'text', nullable: true })
    keywords_ar!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ogTitle_en!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ogTitle_ar!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    ogDescription_en!: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    ogDescription_ar!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    ogImage!: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    ogImageAlt_en!: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    ogImageAlt_ar!: string;

    // Shared with the dashboard and web app (@repo/constants/twitter-card).
    @Column({ type: 'enum', enum: TwitterCard, default: DEFAULT_TWITTER_CARD, nullable: false })
    twitterCard!: TwitterCard;

    @Column({ type: 'varchar', length: 50, nullable: true })
    twitterHandle!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    jobTitle_en!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    jobTitle_ar!: string;

    @Column({ type: 'boolean', default: true, nullable: false })
    robotsIndex!: boolean;

    @Column({ type: 'boolean', default: true, nullable: false })
    robotsFollow!: boolean;

    // Whether the website uses this row for its page (PATCH /seo/:id/toggle-active).
    @Column({ type: 'boolean', default: false, nullable: false })
    isActive!: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updatedAt!: Date;

    @ManyToOne(
        () => User,
        (user) => user.seos,
        {
            nullable: false,
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn()
    user!: User;
}
