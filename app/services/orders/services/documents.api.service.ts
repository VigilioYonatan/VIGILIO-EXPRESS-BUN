import { Injectable } from "@vigilio/express-core";
import { Documents } from "../entities/documents.entity";

@Injectable()
export class DocumentsApiService {
	async index() {
		const data = await Documents.findAll();
		return {
			success: true,
			data,
		};
	}
}
