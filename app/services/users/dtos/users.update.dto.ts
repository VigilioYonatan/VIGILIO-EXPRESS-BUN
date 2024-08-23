import { type Input, pickAsync } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersUpdateDto = pickAsync(usersSchema, ["role_id", "enabled"]);
export type UsersUpdateDto = Input<typeof usersUpdateDto>;
