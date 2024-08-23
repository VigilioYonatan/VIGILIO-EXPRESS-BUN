import {
	type Input,
	number,
	objectAsync,
	string,
	minLength,
	toTrimmed,
	maxLength,
} from "@vigilio/valibot";

export const featuresSchema = objectAsync({
	id: number(),
	value: string([toTrimmed(), minLength(1), maxLength(45)]),
	description: string([toTrimmed(), minLength(1), maxLength(45)]),
	option_id: number(),
});
export type FeaturesSchema = Input<typeof featuresSchema>;
