import enviroments from "~/config/enviroments.config";
import type { SunatInvoiceDto } from "./dtos/sunat.invoice.dto";
import { BadRequestException } from "@vigilio/express-core";

export async function invoiceXMLSunatApi(body: SunatInvoiceDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/invoices/xml`,
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
