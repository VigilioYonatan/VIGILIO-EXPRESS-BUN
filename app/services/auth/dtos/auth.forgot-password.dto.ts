import { usersSchema } from "@/users/schemas/users.schema";
import { type Input, pickAsync } from "@vigilio/valibot";

export const authForgotPasswordDto = pickAsync(usersSchema, ["email"]);
export type AuthForgotPasswordDto = Input<typeof authForgotPasswordDto>;
