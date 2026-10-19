import { setSeederFactory } from 'typeorm-extension';
import { WhatCanDo } from '../../what-can-do/entities/what-can-do.entity';
import { faker } from '@faker-js/faker';

// rank is set by the seeder, which numbers each owner's rows 1..n.
export default setSeederFactory(WhatCanDo, () => {
    const whatCanDo = new WhatCanDo();
    whatCanDo.title = faker.person.jobArea().concat(' ', faker.hacker.noun()).slice(0, 50);
    whatCanDo.shortDescription = faker.hacker.phrase().slice(0, 100);
    whatCanDo.description = faker.lorem.paragraph();
    return whatCanDo;
});
