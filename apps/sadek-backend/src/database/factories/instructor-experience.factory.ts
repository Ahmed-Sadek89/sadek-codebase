import { setSeederFactory } from 'typeorm-extension';
import { InstructorExperience } from '../../instructor-experience/entities/instructor-experience.entity';
import { faker, fakerAR } from '@faker-js/faker';
import {
    INSTRUCTOR_EXPERIENCE_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX,
    INSTRUCTOR_EXPERIENCE_RANK_MIN,
} from '@repo/constants/instructor-experience';
import { URL_MAX } from '@repo/constants/url';

export default setSeederFactory(InstructorExperience, () => {
    const instructorExperience = new InstructorExperience();
    const startAt = faker.date.past({ years: 6 });
    instructorExperience.name = `${faker.hacker.adjective()} ${faker.hacker.noun()} course`.slice(0, INSTRUCTOR_EXPERIENCE_NAME_MAX);
    instructorExperience.courseLink = faker.internet.url().slice(0, URL_MAX);
    instructorExperience.coverPhotoUrl = faker.image.url({ width: 1200, height: 630 });
    instructorExperience.descriptionEn = `<p>${faker.lorem.paragraph()}</p>`;
    instructorExperience.descriptionAr = `<p>${fakerAR.lorem.paragraph()}</p>`;
    instructorExperience.startAt = startAt;
    instructorExperience.endAt = faker.date.between({ from: startAt, to: new Date() });
    instructorExperience.coursePlatformName = faker.company.name().slice(0, INSTRUCTOR_EXPERIENCE_PLATFORM_NAME_MAX);
    instructorExperience.coursePlatformUrl = faker.internet.url().slice(0, URL_MAX);
    instructorExperience.rank = faker.number.int({ min: INSTRUCTOR_EXPERIENCE_RANK_MIN, max: 50 });
    instructorExperience.isActive = faker.datatype.boolean({ probability: 0.75 });
    return instructorExperience;
});
