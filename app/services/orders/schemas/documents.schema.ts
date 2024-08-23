import { objectAsync, string, type Input } from "@vigilio/valibot";

export const documentsSchema = objectAsync({
	code: string(),
	name: string(),
});

export type DocumentsSchema = Input<typeof documentsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
