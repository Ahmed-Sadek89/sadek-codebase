import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../user/entities/user.entity';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const SEED_PASSWORD = bcrypt.hashSync('Password@123', 10);

export default setSeederFactory(User, () => {
    const user = new User();
    user.firstName = faker.person.firstName().slice(0, 10);
    user.lastName = faker.person.lastName().slice(0, 10);
    user.age = faker.number.int({min: 20, max: 80})
    // A random suffix keeps the unique emails from colliding across 100 users.
    user.email = faker.internet
        .email({
            firstName: user.firstName,
            lastName: `${user.lastName}.${faker.string.alphanumeric(6)}`,
        })
        .toLowerCase()
        .slice(0, 70);
    user.password = SEED_PASSWORD;
    user.avatarUrl = faker.image.avatar();
    return user;
});
