import { CategorySkill } from '../../../category_skills/entities/category_skill.entity';

/** Fields a seeded category gets; `user` is set per owner by the seeder. */
export type CategorySkillSeed = Pick<
  CategorySkill,
  'nameAr' | 'nameEn' | 'descriptionAr' | 'descriptionEn' | 'isActive'
>;

// nameAr/nameEn must stay within the entity's 50-character limit.
export const CATEGORY_SKILLS_SEED: CategorySkillSeed[] = [
  {
    nameEn: 'Frontend',
    nameAr: 'الواجهة الأمامية',
    descriptionEn: 'Building user interfaces for the web.',
    descriptionAr: 'بناء واجهات المستخدم للويب.',
    isActive: true,
  },
  {
    nameEn: 'Backend',
    nameAr: 'الواجهة الخلفية',
    descriptionEn: 'Server-side logic, APIs, and authentication.',
    descriptionAr: 'منطق الخادم وواجهات البرمجة والمصادقة.',
    isActive: true,
  },
  {
    nameEn: 'Databases',
    nameAr: 'قواعد البيانات',
    descriptionEn: 'Data modeling, SQL, and query optimization.',
    descriptionAr: 'نمذجة البيانات ولغة SQL وتحسين الاستعلامات.',
    isActive: true,
  },
  {
    nameEn: 'Mobile',
    nameAr: 'تطبيقات الجوال',
    descriptionEn: 'Cross-platform and native mobile apps.',
    descriptionAr: 'تطبيقات الجوال الأصلية ومتعددة المنصات.',
    isActive: true,
  },
  {
    nameEn: 'DevOps & Cloud',
    nameAr: 'DevOps والحوسبة السحابية',
    descriptionEn: 'CI/CD, containers, and cloud deployment.',
    descriptionAr: 'التكامل والنشر المستمر والحاويات والنشر السحابي.',
    isActive: true,
  },
  {
    nameEn: 'Testing',
    nameAr: 'الاختبار',
    descriptionEn: 'Unit, integration, and end-to-end testing.',
    descriptionAr: 'اختبارات الوحدات والتكامل والاختبارات الشاملة.',
    isActive: true,
  },
  {
    nameEn: 'UI/UX Design',
    nameAr: 'تصميم واجهة وتجربة المستخدم',
    descriptionEn: 'Wireframes, prototypes, and design systems.',
    descriptionAr: 'المخططات والنماذج الأولية وأنظمة التصميم.',
    isActive: true,
  },
  {
    nameEn: 'Soft Skills',
    nameAr: 'المهارات الشخصية',
    descriptionEn: 'Communication, teamwork, and leadership.',
    descriptionAr: 'التواصل والعمل الجماعي والقيادة.',
    // One inactive row so the isActive filter has something to hide.
    isActive: false,
  },
];
