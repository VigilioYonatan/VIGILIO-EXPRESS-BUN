import { type Input, omitAsync } from "@vigilio/valibot";
import { guidesSchema } from "../schemas/guides.schema";

export const guidesUpdateDto = omitAsync(guidesSchema, ["id"]);
export type GuidesUpdateDto = Input<typeof guidesUpdateDto>;
