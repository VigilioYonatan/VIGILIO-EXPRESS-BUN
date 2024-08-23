import { type Input } from "@vigilio/valibot";
import { companySchema } from "../schemas/information.schema";

export const informationFacturacionUpdateDto = companySchema;

export type InformationFacturacionUpdateDto = Input<
	typeof informationFacturacionUpdateDto
>;
