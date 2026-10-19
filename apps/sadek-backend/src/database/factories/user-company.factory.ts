import { setSeederFactory } from 'typeorm-extension';
import { UserCompany } from '../../user-company/entities/user-company.entity';
import { faker, fakerAR } from '@faker-js/faker';

export default setSeederFactory(UserCompany, () => {
    const userCompany = new UserCompany();
    const startWorkFrom = faker.date.past({ years: 10 });
    userCompany.name_en = faker.company.name().slice(0, 50);
    userCompany.name_ar = fakerAR.company.name().slice(0, 50);
    userCompany.description_en = faker.company.catchPhrase();
    userCompany.description_ar = fakerAR.lorem.sentence();
    userCompany.startWorkFrom = startWorkFrom;
    // Some jobs are still ongoing (no end date); the rest end after they start.
    userCompany.startWorkTo = faker.helpers.maybe(
        () => faker.date.between({ from: startWorkFrom, to: new Date() }),
        { probability: 0.8 },
    ) as Date;
    userCompany.logo = faker.image.url({ width: 256, height: 256 });
    userCompany.company_site = faker.internet.url().slice(0, 255);
    return userCompany;
});
