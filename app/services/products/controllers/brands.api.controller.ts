import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Injectable,
    Put,
    Status,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { brandsStoreDto, type BrandsStoreDto } from "../dtos/brands.store.dto";
import {
    brandsUpdateDto,
    type BrandsUpdateDto,
} from "../dtos/brands.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "@/information/entities/information.entity";
import type { BrandsApiService } from "../services/brands.api.service";

@Injectable()
@Controller("/brands")
export class BrandsApiController {
    constructor(private readonly brandsApiService: BrandsApiService) {}

    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.brandsApiService.index(information);
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(
        @Req("information") information: InformationEntity,
        @Params("slug") slug: string
    ) {
        const result = await this.brandsApiService.show(information, slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(brandsStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: BrandsStoreDto
    ) {
        const result = await this.brandsApiService.store(information, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(brandsUpdateDto)
    @Status(200)
    @Put("/:id")
    async update(
        @Req("information") information: InformationEntity,
        @Params("id") id: string,
        @Body() body: BrandsUpdateDto
    ) {
        const result = await this.brandsApiService.update(
            information,
            id,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(
        @Req("information") information: InformationEntity,
        @Params("id") id: string
    ) {
        const result = await this.brandsApiService.destroy(information, id);
        return result;
    }
}
