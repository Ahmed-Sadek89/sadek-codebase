import { setSeederFactory } from 'typeorm-extension';
import { UserCompany } from '../../user-company/entities/user-company.entity';
import { faker, fakerAR } from '@faker-js/faker';
import {
    EMPLOYMENT_TYPES,
    LOCATION_TYPES,
    USER_COMPANY_JOB_TITLE_MAX,
    USER_COMPANY_LOCATION_MAX,
} from '@repo/constants/user-company';

export default setSeederFactory(UserCompany, () => {
    const userCompany = new UserCompany();
    const startWorkFrom = faker.date.past({ years: 10 });
    userCompany.company_name = faker.company.name().slice(0, 50);
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
    userCompany.job_title = faker.person.jobTitle().slice(0, USER_COMPANY_JOB_TITLE_MAX);
    userCompany.location = `${faker.location.city()}, ${faker.location.country()}`.slice(0, USER_COMPANY_LOCATION_MAX);
    userCompany.location_type = faker.helpers.arrayElement(LOCATION_TYPES);
    userCompany.employment_type = faker.helpers.arrayElement(EMPLOYMENT_TYPES);
    userCompany.isActive = true;
    return userCompany;
});
