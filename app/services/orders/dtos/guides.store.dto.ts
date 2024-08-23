import { type Input, omitAsync } from "@vigilio/valibot";
import { guidesSchema } from "../schemas/guides.schema";

export const guidesStoreDto = omitAsync(guidesSchema, ["id"]);
export type GuidesStoreDto = Input<typeof guidesStoreDto>;
