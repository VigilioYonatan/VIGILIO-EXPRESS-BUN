import { omitAsync, type Input } from "@vigilio/valibot";
import { invoicesSchema } from "../schemas/invoices.schema";

export const invoicesStoreDto = omitAsync(invoicesSchema, ["id"]);
export type InvoicesStoreDto = Input<typeof invoicesStoreDto>;
