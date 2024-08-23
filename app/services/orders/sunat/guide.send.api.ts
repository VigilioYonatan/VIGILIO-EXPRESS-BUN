import enviroments from "~/config/enviroments.config";
import type { SunatGuideDto } from "./dtos/sunat.guide.dto";
import { BadRequestException } from "@vigilio/express-core";
import type { InvoiceResponseSunat } from "../schemas/invoices.schema";

export async function guideSendSunatApi(body: SunatGuideDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/despatches/send`,
		{
			body: JSON.stringify(body),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	const result: GuideSunatAPI = await response.json();

	if (!response.ok)
		throw new BadRequestException("Hubo un error, comunicarte con la empresa");

	return result;
}

export interface GuideSunatAPI {
	sunatResponse: InvoiceResponseSunat & { success: boolean; cdrZip: string };
	hash: string;
}
export interface GuideSunatErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
