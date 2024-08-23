import enviroments from "~/config/enviroments.config";
import type { SunatNoteDto } from "./dtos/sunat.note.dto";
import { BadRequestException } from "@vigilio/express-core";

export async function notePDFSunatApi(body: SunatNoteDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/notes/pdf?type=ticket`,
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
	const result: string = await response.text();
	return result;
}
