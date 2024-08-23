import { type Input, omitAsync } from "@vigilio/valibot";
import { couponsSchema } from "../schemas/coupons.schema";

export const couponsUpdateDto = omitAsync(couponsSchema, ["id"]);

export type CouponsUpdateDto = Input<typeof couponsUpdateDto>;
