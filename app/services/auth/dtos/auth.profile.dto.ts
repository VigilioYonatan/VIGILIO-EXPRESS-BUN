import { usersSchema } from "@/users/schemas/users.schema";
import { type Input, pickAsync } from "@vigilio/valibot";

export const authProfileDto = pickAsync(usersSchema, [
    "name",
    "lastname",
    "address",
    "birthday",
    "address",
    "telephone",
]);

export type AuthProfileDto = Input<typeof authProfileDto>;
