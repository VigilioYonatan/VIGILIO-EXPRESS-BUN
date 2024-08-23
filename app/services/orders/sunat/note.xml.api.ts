import enviroments from "~/config/enviroments.config";
import type { SunatNoteDto } from "./dtos/sunat.note.dto";
import { BadRequestException } from "@vigilio/express-core";

export async function noteXMLSunatApi(body: SunatNoteDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/notes/xml`,
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
