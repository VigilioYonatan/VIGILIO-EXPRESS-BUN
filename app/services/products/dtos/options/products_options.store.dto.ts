import { productsOptionsSchema } from "@/products/schemas/options/products_options.schema";
import { omitAsync, type Input } from "@vigilio/valibot";

export const productsOptionsStoreDto = omitAsync(productsOptionsSchema, [
    "product_normal_id",
]);

export type ProductsOptionsStoreDto = Input<typeof productsOptionsStoreDto>;
