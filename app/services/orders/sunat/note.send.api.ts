import enviroments from "~/config/enviroments.config";
import type { SunatNoteDto } from "./dtos/sunat.note.dto";
import { BadRequestException } from "@vigilio/express-core";
import type { NoteResponseSunat } from "../schemas/notes.schema";

export async function noteSendSunatApi(body: SunatNoteDto) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_SUNAT}/api/notes/send`,
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
	const result: NoteSunatAPI = await response.json();
	return result;
}

export interface NoteSunatAPI {
	sunatResponse: NoteResponseSunat & { success: true; cdrZip: string };
	hash: string;
}
export interface NoteSunatErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
