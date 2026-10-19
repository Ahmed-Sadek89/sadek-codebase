import { setSeederFactory } from 'typeorm-extension';
import { UserInfo } from '../../user-info/entities/user-info.entity';
import { faker, fakerAR } from '@faker-js/faker';

export default setSeederFactory(UserInfo, () => {
    const userInfo = new UserInfo();
    const handle = faker.internet.userName().toLowerCase();
    userInfo.headTitle_en = faker.person.jobTitle().slice(0, 100);
    // fakerAR has no job-title data (person.jobTitle() throws), so use plain words.
    userInfo.headTitle_ar = fakerAR.lorem.words(3).slice(0, 100);
    userInfo.shortDescription_en = faker.company.catchPhrase().slice(0, 255);
    userInfo.shortDescription_ar = fakerAR.lorem.sentence().slice(0, 255);
    userInfo.description_en = faker.lorem.paragraphs(2);
    userInfo.description_ar = fakerAR.lorem.paragraphs(2);
    userInfo.yearsOfExp = faker.number.int({ min: 1, max: 20 });
    userInfo.companies = faker.number.int({ min: 1, max: 8 });
    userInfo.projectNumbers = faker.number.int({ min: 5, max: 60 });
    userInfo.techMastering = faker.number.int({ min: 5, max: 40 });
    userInfo.gmail = `${handle}@gmail.com`.slice(0, 255);
    userInfo.linkedin = `https://www.linkedin.com/in/${handle}`;
    userInfo.github = `https://github.com/${handle}`;
    userInfo.cv = faker.internet.url();
    return userInfo;
});
