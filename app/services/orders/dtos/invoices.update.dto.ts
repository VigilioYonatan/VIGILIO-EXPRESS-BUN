import { omitAsync, type Input } from "@vigilio/valibot";
import { invoicesSchema } from "../schemas/invoices.schema";

export const invoicesUpdateDto = omitAsync(invoicesSchema, ["id"]);
export type InvoicesUpdateDto = Input<typeof invoicesUpdateDto>;
