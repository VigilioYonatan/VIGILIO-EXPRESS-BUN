import { objectAsync, type Input, string } from "@vigilio/valibot";

export const kindInvoiceSchema = objectAsync({
	code: string(),
	name: string(),
});

export type KindInvoiceSchema = Input<typeof kindInvoiceSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
