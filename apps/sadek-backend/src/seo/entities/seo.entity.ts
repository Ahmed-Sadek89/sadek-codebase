import type { SeoHreflang } from '@repo/constants/hreflang';
import { SeoPageName } from '@repo/constants/seo-pages';
import { DEFAULT_TWITTER_CARD, TwitterCard } from '@repo/constants/twitter-card';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

// Partial unique index: at most one active row per user and page.
@Index('UQ_seo_user_page_active', ['user', 'pageName'], { unique: true, where: '"isActive" = true' })
@Entity('seo')
export class Seo {
    @PrimaryGeneratedColumn()
    id!: number;

    // Shared with the dashboard and web app (@repo/constants/seo-pages).
    @Column({ type: 'enum', enum: SeoPageName, nullable: false, unique: true })
    pageName!: SeoPageName;

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

    // The row the website uses for `pageName`; at most one active row per user and page.
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
