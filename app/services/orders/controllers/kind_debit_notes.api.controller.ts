import { Injectable } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { KindDebitNotesApiService } from "../services/kind_debit_notes.api.service";

@Injectable()
@Controller("/kind_debit_notes")
export class KindDebitNotesApiController {
	constructor(
		private readonly kindDebitNotesApiService: KindDebitNotesApiService,
	) {}

	@Get("/")
	async index() {
		const result = await this.kindDebitNotesApiService.index();
		return result;
	}
}
