import { number, objectAsync, type Input, string } from "@vigilio/valibot";

export const payMethodsSchema = objectAsync({
	id: number(),
	name: string(),
});

export type PayMethodsSchema = Input<typeof payMethodsSchema>;
