import { Injectable } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { DocumentsApiService } from "../services/documents.api.service";

@Injectable()
@Controller("/documents")
export class DocumentsApiController {
	constructor(private readonly documentsApiService: DocumentsApiService) {}
	@Get("/")
	async index() {
		const result = await this.documentsApiService.index();
		return result;
	}
}
