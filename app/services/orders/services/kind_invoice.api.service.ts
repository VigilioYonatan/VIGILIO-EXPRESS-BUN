import { Injectable } from "@vigilio/express-core";
import { KindInvoice } from "../entities/kind_invoice.entity";
@Injectable()
export class KindInvoiceApiService {
	async index() {
		const data = await KindInvoice.findAll();
		return {
			success: true,
			data,
		};
	}
}
