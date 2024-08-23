import { Injectable } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { KindInvoiceApiService } from "../services/kind_invoice.api.service";

@Injectable()
@Controller("/kind_invoice")
export class KindInvoiceApiController {
	constructor(private readonly kindInvoiceApiService: KindInvoiceApiService) {}

	@Get("/")
	async index() {
		const result = await this.kindInvoiceApiService.index();
		return result;
	}
}
