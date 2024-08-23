import type { Request } from "express";
import { type UploadsEntities, type UploadsProperties } from "../libs/helpers";
import { Controller, Params, Post, Req } from "@vigilio/express-core";
import { File } from "formidable";
import { Upload } from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { Injectable } from "@vigilio/express-core";
import { UploadsService } from "../services/uploads.service";
import { uploadsStorePipe } from "../pipes/uploads.store.pipe";
import { uploadsUpdatePipe } from "../pipes/uploads.update.pipe";

@Injectable()
@Controller("/uploads")
export class UploadsController {
	constructor(private readonly uploadsService: UploadsService) {}

	@Pipe(uploadsStorePipe)
	@Upload()
	@Post("/:entity/:property")
	store(
		@Params("entity")
		entity: UploadsEntities,
		@Params("property") property: UploadsProperties,
		@Req() req: Request & { files: File[]; filesName?: string },
	) {
		const result = this.uploadsService.store({
			req,
			property,
			entity,
		});
		return result;
	}

	@Pipe(uploadsUpdatePipe)
	@Upload()
	@Post("/:entity/:property/:id")
	update(
		@Params("entity") entity: UploadsEntities,
		@Params("id") id: string,
		@Params("property") property: UploadsProperties,
		@Req() req: Request & { files: File[]; filesName?: string },
	) {
		const result = this.uploadsService.update({
			req,
			id,
			property,
			entity,
		});
		return result;
	}
}
