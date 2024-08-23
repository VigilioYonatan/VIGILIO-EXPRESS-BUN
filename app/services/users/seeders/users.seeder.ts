import { slug } from "@vigilio/express-core/helpers";
import { faker } from "@faker-js/faker";
import type { UsersSchema } from "../schemas/users.schema";
import bcryptjs from "bcryptjs";

export const adminUser: Omit<UsersSchema, "id"> = {
    name: "yonatan",
    lastname: null,
    email: "admin@gmail.com",
    password: bcryptjs.hashSync("123456"),
    telephone: null,
    user_code: "USER-1000",
    username: "Vigilio1000",
    enabled: true,
    address: null,
    birthday: new Date(),
    dni: faker.string.numeric(8),
    photo: null,
    token: null,
    isOnline: false,
    slug: slug("Vigilio1000"),
    enabledNotification: true,
    subscription: null,
    role_id: 1,
    information_id: 1,
};
