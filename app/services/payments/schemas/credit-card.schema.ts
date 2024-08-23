import { custom, email, string, type Input, object } from "@vigilio/valibot";

export const creditCardSchema = object({
	cardNumber: string(),
	expiration: string([
		custom(
			(val) => new RegExp(/^(0[1-9]|1[0-2])\/([0-9]{2})$/).test(val),
			"Fecha no valida.",
		),
	]),
	cvv2: string(),
	firstName: string(),
	lastName: string(),
	email: string([email()]),
});

export type CreditCardSchema = Input<typeof creditCardSchema>;
