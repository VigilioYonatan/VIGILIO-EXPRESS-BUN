import { Injectable } from "@vigilio/express-core";
import { KindDebitNotes } from "../entities/kind_debit_notes.entity";

@Injectable()
export class KindDebitNotesApiService {
	async index() {
		const data = await KindDebitNotes.findAll();
		return {
			success: true,
			data,
		};
	}
}
