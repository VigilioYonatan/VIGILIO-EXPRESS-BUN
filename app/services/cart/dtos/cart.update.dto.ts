import { type Input, omitAsync } from "@vigilio/valibot";
import { cartSchema } from "../schemas/cart.schema";

export const cartUpdateDto = omitAsync(cartSchema, ["user_id"]);
export type CartUpdateDto = Input<typeof cartUpdateDto>;
