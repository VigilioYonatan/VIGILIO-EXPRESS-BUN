import {
	type Input,
	objectAsync,
	mergeAsync,
	pickAsync,
	numberAsync,
	getPipeIssues,
	getOutput,
} from "@vigilio/valibot";
import { authRegisterDto } from "./auth.register.dto";

export const authConfirmPasswordDto = mergeAsync(
	[
		pickAsync(authRegisterDto, ["password", "repeat_password"]),
		objectAsync({
			user_id: numberAsync("Este campo es obligatorio"),
		}),
	],
	[
		(input) => {
			if (input.repeat_password !== input.password) {
				return getPipeIssues(
					"repeat_password",
					"Contraseñas no similares",
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type AuthConfirmPasswordDto = Input<typeof authConfirmPasswordDto>;
