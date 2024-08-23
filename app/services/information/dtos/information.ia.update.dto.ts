import { pickAsync, type Input } from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";

export const informationIAUpdateDto = pickAsync(informationSchema, [
	"inteligenceArtificial",
]);
export type InformationIAUpdateDto = Input<typeof informationIAUpdateDto>;
