import { Injectable } from "@vigilio/express-core";
import { DetailOrdersApiService } from "../services/detail_orders.api.service";
import { Controller, Delete, Get, Params, Status } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";

@Injectable()
@Controller("/detail_orders")
export class DetailOrdersApiController {
	constructor(
		private readonly detailOrdersApiService: DetailOrdersApiService,
	) {}

	@Get("/")
	async index() {
		const result = await this.detailOrdersApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") slug: string) {
		const result = await this.detailOrdersApiService.show(slug);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Params("id") id: string) {
		const result = await this.detailOrdersApiService.destroy(id);
		return result;
	}
}
