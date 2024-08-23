import {
	type Input,
	objectAsync,
	string,
	number,
	boolean,
} from "@vigilio/valibot";

// https://github.com/ernestorivero/Ubigeo-Peru/
export const departmentsSchema = objectAsync({
	ubigeo: string(),
	name: string(),
	enabled: boolean(),
	priceShipping: number(),
	days: number(),
});

export type DepartmentsSchema = Input<typeof departmentsSchema>;
