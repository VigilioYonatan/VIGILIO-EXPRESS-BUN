import { Injectable } from "@vigilio/express-core";
import { Controller, Get, Params } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { GuidesApiService } from "../services/guides.api.service";

@Injectable()
@Controller("/guides")
export class GuidesApiController {
	constructor(private readonly guidesApiService: GuidesApiService) {}

	@Pipe(objectAsync({ kind_guide_code: string("Este campo es obligatorio") }))
	@Get("/latest_correlativo/:kind_guide_code")
	async latestCorrelativo(@Params("kind_guide_code") kind_guide_code: string) {
		const result =
			await this.guidesApiService.latestCorrelativo(kind_guide_code);
		return result;
	}

	@Pipe(
		objectAsync({
			serie_correlative: string("Este campo es obligatorio"),
		}),
	)
	@Get("/:serie_correlative")
	async show(@Params("serie_correlative") serie_correlative: string) {
		const result = await this.guidesApiService.show(serie_correlative);
		return result;
	}
}
