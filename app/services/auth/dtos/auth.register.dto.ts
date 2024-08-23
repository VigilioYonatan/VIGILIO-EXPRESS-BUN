import { Users } from "@/users/entities/users.entity";
import { usersSchema, type UsersSchema } from "@/users/schemas/users.schema";
import {
    type Input,
    object,
    string,
    minLength,
    mergeAsync,
    pickAsync,
    getPipeIssues,
    getOutput,
} from "@vigilio/valibot";

export const authRegisterDto = mergeAsync(
    [
        pickAsync(usersSchema, ["username", "name", "email", "password"]),
        object({
            repeat_password: string([
                minLength(1, "Este campo es obligatorio"),
            ]),
        }),
    ],
    [
        async (input) => {
            if (input.repeat_password !== input.password) {
                return getPipeIssues(
                    "repeat_password",
                    "Contraseñas no similares",
                    input
                );
            }
            const [byUser_name, byEmail] = await Promise.all([
                Users.findOne({
                    where: {
                        username: input.username,
                    },
                    raw: true,
                }),
                Users.findOne({
                    where: {
                        email: input.email,
                    },
                    raw: true,
                }),
            ]);

            if (byUser_name) {
                return getPipeIssues(
                    "username" as keyof UsersSchema,
                    `Ya existe un usuario con el nombre de usuario ${input.username}`,
                    input
                );
            }

            if (byEmail) {
                return getPipeIssues(
                    "email" as keyof UsersSchema,
                    `Ya existe un usuario con el correo ${input.email}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
