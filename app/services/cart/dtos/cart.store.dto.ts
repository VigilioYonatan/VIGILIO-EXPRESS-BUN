import { type Input, omitAsync } from "@vigilio/valibot";
import { cartSchema } from "../schemas/cart.schema";

export const cartStoreDto = omitAsync(cartSchema, ["user_id"]);
export type CartStoreDto = Input<typeof cartStoreDto>;
