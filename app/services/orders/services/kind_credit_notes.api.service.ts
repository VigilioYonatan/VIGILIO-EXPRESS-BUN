import { Injectable } from "@vigilio/express-core";
import { KindCreditNotes } from "../entities/kind_credit_notes.entity";

@Injectable()
export class KindCreditNotesApiService {
	async index() {
		const data = await KindCreditNotes.findAll();
		return {
			success: true,
			data,
		};
	}
}
