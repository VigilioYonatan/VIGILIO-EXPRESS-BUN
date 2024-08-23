import { type Input, number, objectAsync } from "@vigilio/valibot";

export const variantsfeaturesSchema = objectAsync({
    variant_id: number(),
    feature_id: number(),
    information_id: number(),
});
export type VariantsfeaturesSchema = Input<typeof variantsfeaturesSchema>;
