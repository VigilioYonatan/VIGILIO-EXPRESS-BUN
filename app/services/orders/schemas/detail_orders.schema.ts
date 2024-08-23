import type { Products } from "@/products/libs";
import {
    nullable,
    number,
    objectAsync,
    string,
    type Input,
} from "@vigilio/valibot";

export const detailOrdersSchema = objectAsync({
    id: number(),
    quantity: number(),
    price: number(),
    order_id: number(),
    product_normal_id: nullable(number()),
    product_restaurant_id: nullable(number()),
    product_servicio_id: nullable(number()),
    variant_id: nullable(number()),
    information_id: number(),
    coupon: nullable(string()),
});

export type DetailOrdersSchema = Input<typeof detailOrdersSchema>;
export type DetailOrdersFromServer = DetailOrdersSchema & Products;
