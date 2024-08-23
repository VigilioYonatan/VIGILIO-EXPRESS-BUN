import enviroments from "~/config/enviroments.config";
import type { SunatGuideDto } from "./dtos/sunat.guide.dto";
import { BadRequestException } from "@vigilio/express-core";

export async function guideXMLSunatApi(body: SunatGuideDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/despatches/xml`,
		{
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	if (!response.ok)
		throw new BadRequestException("Hubo un error, comunicarte con la empresa");
	const result = await response.text();
	return result;
}
