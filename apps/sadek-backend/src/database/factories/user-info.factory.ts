import { setSeederFactory } from 'typeorm-extension';
import { UserInfo } from '../../user-info/entities/user-info.entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory(UserInfo, () => {
    const userInfo = new UserInfo();
    const handle = faker.internet.userName().toLowerCase();
    userInfo.headTitle = faker.person.jobTitle().slice(0, 100);
    userInfo.shortDescription = faker.company.catchPhrase().slice(0, 255);
    userInfo.description = faker.lorem.paragraphs(2);
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
