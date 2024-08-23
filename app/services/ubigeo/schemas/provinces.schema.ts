import { type Input, objectAsync, string } from "@vigilio/valibot";

export const provincesSchema = objectAsync({
	ubigeo: string(),
	name: string(),
	department_id: string(),
});

export type ProvincesSchema = Input<typeof provincesSchema>;
