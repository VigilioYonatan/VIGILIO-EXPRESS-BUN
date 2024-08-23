import type { Products } from "@/products/libs";
import type { VariantsSchema } from "@/products/schemas/options/variants.schema";
import {
    type Input,
    number,
    objectAsync,
    minValue,
    nullable,
    string,
} from "@vigilio/valibot";

export const cartSchema = objectAsync({
    quantity: number([minValue(1, "Minimo 1  cantidad")]),
    coupon: nullable(string()),
    product_normal_id: nullable(number()),
    product_restaurant_id: nullable(number()),
    product_servicio_id: nullable(number()),
    variant_id: nullable(number()),
    user_id: number(),
    information_id: number(),
});
export type CartSchema = Input<typeof cartSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type CartSchemaFromServer = Input<typeof cartSchema> &
    Products & { variant: VariantsSchema };
