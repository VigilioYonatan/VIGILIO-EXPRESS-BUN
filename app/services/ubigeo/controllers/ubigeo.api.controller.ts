import { Body, Injectable, Params, Put } from "@vigilio/express-core";
import { Controller, Get } from "@vigilio/express-core";
import { UbigeoApiService } from "../services/ubigeo.api.service";
import type { DepartmentsUpdateDto } from "../dtos/departments.update.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { Pipe } from "@vigilio/express-core/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/ubigeo")
export class UbigeoApiController {
	constructor(private readonly ubigeoApiService: UbigeoApiService) {}

	@Get("/departments")
	async departments() {
		const result = await this.ubigeoApiService.departments();
		return result;
	}

	@Pipe(objectAsync({ ubigeo: string() }))
	@Get("/departments/:ubigeo")
	async departmentsShow(@Params("ubigeo") ubigeo: string) {
		const result = await this.ubigeoApiService.departmentsShow(ubigeo);
		return result;
	}

	@PermissionAdmin()
	@Pipe(objectAsync({ ubigeo: string() }))
	@Put("/departments/:ubigeo")
	async departmentsUpdate(
		@Body() body: DepartmentsUpdateDto,
		@Params("ubigeo") ubigeo: string,
	) {
		const result = await this.ubigeoApiService.departmentsUpdate(ubigeo, body);
		return result;
	}

	@Get("/provinces")
	async provinces() {
		const result = await this.ubigeoApiService.provinces();
		return result;
	}

	@Get("/districts")
	async districts() {
		const result = await this.ubigeoApiService.districts();
		return result;
	}
}
