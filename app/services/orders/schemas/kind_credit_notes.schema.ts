import { objectAsync, type Input, string } from "@vigilio/valibot";

export const kindCreditNotesSchema = objectAsync({
	code: string(),
	name: string(),
});

export type KindCreditNotesSchema = Input<typeof kindCreditNotesSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
