import { slug } from "@vigilio/express-core/helpers";
import {
    type Input,
    number,
    minLength,
    objectAsync,
    email,
    maxLength,
    string,
    array,
    boolean,
    custom,
    date,
    coerce,
    nullable,
    startsWith,
    transform,
    toTrimmed,
    nullableAsync,
    object,
} from "@vigilio/valibot";
import { usersPhotoQualities } from "../libs";
import { filesSchema } from "@/uploads/schemas/uploads.schema";

export const subscription = objectAsync({
    endpoint: string(),
    keys: object({ p256dh: string(), auth: string() }),
});
export type Subscription = Input<typeof subscription>;
export const usersSchema = objectAsync({
    id: number(),
    user_code: string(),
    username: string([toTrimmed(), minLength(1), minLength(6), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
    lastname: nullable(string([toTrimmed(), minLength(3), maxLength(60)])),
    birthday: nullable(coerce(date(), (value) => new Date(value as string))),
    email: string([toTrimmed(), minLength(1), email(), maxLength(100)]),
    password: string([toTrimmed(), minLength(1), minLength(6), maxLength(30)]),
    address: nullable(string([toTrimmed(), minLength(10), maxLength(100)])),
    dni: nullable(
        string([
            toTrimmed(),
            minLength(8),
            maxLength(8),
            custom((value) => /^[0-9]+$/.test(value), "Dni no válido."),
        ])
    ),
    telephone: nullable(
        string([
            toTrimmed(),
            minLength(9),
            maxLength(9),
            custom(
                (value) => /^[0-9]+$/.test(value),
                "Numero de celular válido."
            ),
            startsWith("9"),
        ])
    ),
    photo: nullable(array(filesSchema(usersPhotoQualities))),
    enabled: boolean(),
    isOnline: boolean(),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(30)]),
        slug
    ),
    token: nullable(string()),
    role_id: number(),
    information_id: number(),
    subscription: nullableAsync(subscription),
    enabledNotification: nullable(boolean()),
});

export type UsersSchema = Input<typeof usersSchema> & {
    updatedAt?: Date;
    createdAt?: Date;
};
export type UsersSchemaFromServer = UsersSchema & {
    createdAt?: Date;
    updatedAt?: Date;
};
