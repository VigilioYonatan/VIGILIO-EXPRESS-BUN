import {
	type Input,
	string,
	objectAsync,
	toTrimmed,
	minLength,
	maxLength,
} from "@vigilio/valibot";

export const usersPasswordDto = objectAsync({
	passwordActual: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
	]),
	newPassword: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
	]),
	repeatNewPassword: string("Este campo es obligatorio.", [
		toTrimmed(),
		minLength(1, "Este campo es obligatorio."),
		minLength(6, "Este campo requiere mínimo 6 cáracteres."),
		maxLength(30, "Este campo requiere máximo 30 cáracteres."),
	]),
});
export type UsersPasswordDto = Input<typeof usersPasswordDto>;
