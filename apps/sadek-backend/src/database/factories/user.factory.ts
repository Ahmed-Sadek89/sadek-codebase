import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../user/entities/user.entity';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const SEED_PASSWORD = bcrypt.hashSync('Password@123', 10);

export default setSeederFactory(User, () => {
    const user = new User();
    const firstName = faker.person.firstName().slice(0, 10);
    const lastName = faker.person.lastName().slice(0, 10);
    // A random suffix keeps the unique usernames/emails from colliding across 100 users.
    const suffix = faker.string.alphanumeric(6);
    user.username = `${firstName}.${lastName}.${suffix}`.toLowerCase().slice(0, 50);
    user.email = faker.internet
        .email({ firstName, lastName: `${lastName}.${suffix}` })
        .toLowerCase()
        .slice(0, 70);
    user.password = SEED_PASSWORD;
    user.avatarUrl = faker.image.avatar();
    user.coverPhotoUrl = faker.image.url();
    return user;
});
