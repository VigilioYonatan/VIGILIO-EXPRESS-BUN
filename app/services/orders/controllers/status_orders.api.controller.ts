import { Injectable } from "@vigilio/express-core";
import { StatusOrdersApiService } from "../services/status_orders.api.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import {
	type StatusOrdersStoreDto,
	statusOrdersStoreDto,
} from "../dtos/status_orders.store.dto";
import {
	type StatusOrdersUpdateDto,
	statusOrdersUpdateDto,
} from "../dtos/status_orders.update.dto";
import { objectAsync, string } from "@vigilio/valibot";

@Injectable()
@Controller("/status_orders")
export class StatusOrdersApiController {
	constructor(
		private readonly statusOrdersApiService: StatusOrdersApiService,
	) {}

	@Get("/")
	async index() {
		const result = await this.statusOrdersApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") slug: string) {
		const result = await this.statusOrdersApiService.show(slug);
		return result;
	}

	@Validator(statusOrdersStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: StatusOrdersStoreDto) {
		const result = await this.statusOrdersApiService.store(body);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(statusOrdersUpdateDto)
	@Status(201)
	@Put("/:id")
	async update(@Params("id") id: string, @Body() body: StatusOrdersUpdateDto) {
		const result = await this.statusOrdersApiService.update(id, body);
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
		const result = await this.statusOrdersApiService.destroy(id);
		return result;
	}
}
