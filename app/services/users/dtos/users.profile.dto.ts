import { type Input, pickAsync } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersProfileDto = pickAsync(usersSchema, [
    "name",
    "address",
    "birthday",
    "dni",
    "lastname",
    "telephone",
    "enabledNotification",
]);
export type UsersProfileDto = Input<typeof usersProfileDto>;
