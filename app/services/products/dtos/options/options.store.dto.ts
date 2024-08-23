import { optionsSchema } from "@/products/schemas/options/options.schema";
import {
	arrayAsync,
	mergeAsync,
	objectAsync,
	omitAsync,
	type Input,
} from "@vigilio/valibot";
import { featuresStoreDto } from "./features.store.dto";

export const optionsStoreDto = mergeAsync([
	omitAsync(optionsSchema, ["id"]),
	objectAsync({
		features: arrayAsync(featuresStoreDto),
	}),
]);
export type OptionsStoreDto = Input<typeof optionsStoreDto>;
