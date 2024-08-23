import { omitAsync, type Input } from "@vigilio/valibot";
import { payMethodsSchema } from "../schemas/pay_methods.schema";

export const payMethodsStoreDto = omitAsync(payMethodsSchema, ["id"]);
export type PayMethodsStoreDto = Input<typeof payMethodsStoreDto>;
