import { Injectable } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { KindCreditNotesApiService } from "../services/kind_credit_notes.api.service";

@Injectable()
@Controller("/kind_credit_notes")
export class KindCreditNotesApiController {
	constructor(
		private readonly kindCreditNotesApiService: KindCreditNotesApiService,
	) {}

	@Get("/")
	async index() {
		const result = await this.kindCreditNotesApiService.index();
		return result;
	}
}
