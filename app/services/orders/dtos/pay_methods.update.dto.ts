import { omitAsync, type Input } from "@vigilio/valibot";
import { payMethodsSchema } from "../schemas/pay_methods.schema";

export const payMethodsUpdateDto = omitAsync(payMethodsSchema, ["id"]);
export type PayMethodsUpdateDto = Input<typeof payMethodsUpdateDto>;
