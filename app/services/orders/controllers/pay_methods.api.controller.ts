import { Injectable } from "@vigilio/express-core";
import { PayMethodsApiService } from "../services/pay_methods.api.service";
import { Controller, Get, Params } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";

@Injectable()
@Controller("/pay_methods")
export class PayMethodsApiController {
	constructor(private readonly payMethodsApiService: PayMethodsApiService) {}

	@Get("/")
	async index() {
		const result = await this.payMethodsApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") slug: string) {
		const result = await this.payMethodsApiService.show(slug);
		return result;
	}
}
