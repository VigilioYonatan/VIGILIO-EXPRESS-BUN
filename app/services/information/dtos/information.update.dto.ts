import { type Input, omitAsync } from "@vigilio/valibot";
import { informationSchema } from "../schemas/information.schema";

export const informationUpdateDto = omitAsync(informationSchema, [
    "id",
    "slug",
    "logo",
    "certificado",
    "inteligenceArtificial",
    "contacts",
    "company",

    "schedule",
    "whatsappconfig",
    "groupWhatsapp",
    "icon",
    "token",
]);
export type InformationUpdateDto = Input<typeof informationUpdateDto>;
