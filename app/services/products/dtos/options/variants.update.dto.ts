import { variantsSchema } from "@/products/schemas/options/variants.schema";
import { omitAsync, type Input } from "@vigilio/valibot";

export const variantsUpdateDto = omitAsync(variantsSchema, [
    "id",
    "product_normal_id",
]);
export type VariantsUpdateDto = Input<typeof variantsUpdateDto>;
