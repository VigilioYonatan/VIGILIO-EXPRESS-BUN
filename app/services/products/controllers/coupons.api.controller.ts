import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Put,
    Injectable,
    Status,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { CouponsApiService } from "../services/coupons.api.service";
import {
    couponsUpdateDto,
    type CouponsUpdateDto,
} from "../dtos/coupons.update.dto";
import {
    couponsStoreDto,
    type CouponsStoreDto,
} from "../dtos/coupons.store.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/coupons")
export class CouponsApiController {
    constructor(private readonly couponsApiService: CouponsApiService) {}

    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.couponsApiService.index(information);
        return result;
    }

    @Pipe(
        objectAsync({
            coupon: string(),
        })
    )
    @Get("/:coupon")
    async show(
        @Req("information") information: InformationEntity,
        @Params("coupon") coupon: string
    ) {
        const result = await this.couponsApiService.show(information, coupon);
        return result;
    }

    @PermissionAdmin()
    @Validator(couponsStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: CouponsStoreDto
    ) {
        const result = await this.couponsApiService.store(information, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(couponsUpdateDto)
    @Status(201)
    @Put("/:id")
    async update(
        @Req("information") information: InformationEntity,
        @Params("id") id: string,
        @Body() body: CouponsUpdateDto
    ) {
        const result = await this.couponsApiService.update(
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
        const result = await this.couponsApiService.destroy(information, id);
        return result;
    }
}
