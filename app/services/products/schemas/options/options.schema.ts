import {
	type Input,
	number,
	objectAsync,
	string,
	minLength,
	toTrimmed,
	maxLength,
} from "@vigilio/valibot";

export const optionsSchema = objectAsync({
	id: number(),
	name: string([toTrimmed(), minLength(1), maxLength(45)]),
	type: number(),
});
export type OptionsSchema = Input<typeof optionsSchema>;
