import { setSeederFactory } from 'typeorm-extension';
import { WhatCanDo } from '../../what-can-do/entities/what-can-do.entity';
import { faker, fakerAR } from '@faker-js/faker';

// rank is set by the seeder, which numbers each owner's rows 1..n.
export default setSeederFactory(WhatCanDo, () => {
    const whatCanDo = new WhatCanDo();
    whatCanDo.title_en = faker.person.jobArea().concat(' ', faker.hacker.noun()).slice(0, 50);
    // fakerAR has no job-area data (person.jobArea() throws).
    whatCanDo.title_ar = `${fakerAR.commerce.department()} ${fakerAR.lorem.word()}`.slice(0, 50);
    whatCanDo.shortDescription_en = faker.hacker.phrase().slice(0, 200);
    whatCanDo.shortDescription_ar = fakerAR.lorem.sentence().slice(0, 200);
    whatCanDo.description_en = faker.lorem.paragraph();
    whatCanDo.description_ar = fakerAR.lorem.paragraph();
    whatCanDo.isActive = true;
    return whatCanDo;
});
