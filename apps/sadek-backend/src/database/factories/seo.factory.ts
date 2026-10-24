import { setSeederFactory } from 'typeorm-extension';
import { X_DEFAULT_HREFLANG } from '@repo/constants/hreflang';
import { TWITTER_CARDS } from '@repo/constants/twitter-card';
import { Seo } from '../../seo/entities/seo.entity';
import { faker, fakerAR } from '@faker-js/faker';

export default setSeederFactory(Seo, () => {
    const seo = new Seo();
    const name = faker.person.fullName();
    const jobTitle = faker.person.jobTitle();
    seo.metaTitle_en = `${name} – ${jobTitle}`.slice(0, 70);
    seo.metaTitle_ar = fakerAR.lorem.words(4).slice(0, 70);
    seo.metaDescription_en = faker.lorem.sentences(2).slice(0, 170);
    seo.metaDescription_ar = fakerAR.lorem.sentences(2).slice(0, 170);
    seo.keywords_en = faker.lorem.words(6).split(' ').join(', ');
    seo.keywords_ar = fakerAR.lorem.words(6).split(' ').join(', ');
    seo.ogTitle_en = faker.company.catchPhrase().slice(0, 100);
    seo.ogTitle_ar = fakerAR.lorem.words(4).slice(0, 100);
    seo.ogDescription_en = faker.lorem.sentence().slice(0, 200);
    seo.ogDescription_ar = fakerAR.lorem.sentence().slice(0, 200);
    seo.ogImage = faker.image.url({ width: 1200, height: 630 });
    const site = faker.internet.url({ appendSlash: false });
    seo.canonicalUrl = `${site}/en`;
    seo.hreflang = [
        { lang: 'en', url: `${site}/en` },
        { lang: 'ar', url: `${site}/ar` },
        { lang: X_DEFAULT_HREFLANG, url: `${site}/en` },
    ];
    seo.ogImageAlt_en = faker.lorem.words(5).slice(0, 150);
    seo.ogImageAlt_ar = fakerAR.lorem.words(5).slice(0, 150);
    seo.twitterCard = faker.helpers.arrayElement(TWITTER_CARDS);
    seo.twitterHandle = `@${faker.internet.userName().replace(/\W/g, '').slice(0, 15)}`;
    seo.jobTitle_en = jobTitle.slice(0, 100);
    // fakerAR has no job-title data (person.jobTitle() throws), so use plain words.
    seo.jobTitle_ar = fakerAR.lorem.words(3).slice(0, 100);
    seo.robotsIndex = true;
    seo.robotsFollow = true;
    seo.isActive = false;
    return seo;
});
