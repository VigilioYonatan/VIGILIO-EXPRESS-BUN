import { objectAsync, type Input, string } from "@vigilio/valibot";

export const kindDebitNotesSchema = objectAsync({
	code: string(),
	name: string(),
});

export type KindDebitNotesSchema = Input<typeof kindDebitNotesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
