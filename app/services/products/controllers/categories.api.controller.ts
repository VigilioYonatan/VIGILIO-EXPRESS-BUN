import { Injectable, Req } from "@vigilio/express-core";
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
import { objectAsync, string } from "@vigilio/valibot";
import { CategoriesApiService } from "../services/categories.api.service";
import {
    categoriesStoreDto,
    type CategoriesStoreDto,
} from "../dtos/categories.store.dto";
import {
    categoriesUpdateDto,
    type CategoriesUpdateDto,
} from "../dtos/categories.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/categories")
export class CategoriesApiController {
    constructor(private readonly categoriesApiService: CategoriesApiService) {}

    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.categoriesApiService.index(information);
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
        const result = await this.categoriesApiService.show(information, slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(categoriesStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: CategoriesStoreDto
    ) {
        const result = await this.categoriesApiService.store(information, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(categoriesUpdateDto)
    @Status(200)
    @Put("/:id")
    async update(
        @Req("information") information: InformationEntity,
        @Params("id") id: string,
        @Body() body: CategoriesUpdateDto
    ) {
        const result = await this.categoriesApiService.update(
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
        const result = await this.categoriesApiService.destroy(information, id);
        return result;
    }
}
