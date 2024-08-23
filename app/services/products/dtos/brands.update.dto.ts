import { type Input, omitAsync } from "@vigilio/valibot";
import { brandsSchema } from "../schemas/brands.schema";

export const brandsUpdateDto = omitAsync(brandsSchema, ["id", "brand_code"]);
export type BrandsUpdateDto = Input<typeof brandsUpdateDto>;
