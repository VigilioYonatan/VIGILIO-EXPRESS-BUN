import { featuresSchema } from "@/products/schemas/options/features.schema";
import { omitAsync, type Input } from "@vigilio/valibot";

export const featuresStoreDto = omitAsync(featuresSchema, ["id", "option_id"]);
export type FeaturesStoreDto = Input<typeof featuresStoreDto>;
