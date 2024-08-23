import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Put,
    Req,
    Status,
    Injectable,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { type CartStoreDto, cartStoreDto } from "../dtos/cart.store.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { cartUpdateDto, type CartUpdateDto } from "../dtos/cart.update.dto";
import { CartApiService } from "../services/cart.api.service";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import type { RequestVigilio } from "~/config/types";

@Injectable()
@Controller("/cart")
export class CartApiController {
    constructor(private readonly cartApiService: CartApiService) {}

    @PermissionAuth()
    @Get("/")
    async index(@Req() req: RequestVigilio) {
        const result = await this.cartApiService.index(
            req.information?.id,
            req.user.id
        );
        return result;
    }

    @PermissionAuth()
    @Pipe(
        objectAsync({
            product_id: string(),
        })
    )
    @Get("/:product_id")
    async show(
        @Params("product_id") product_id: string,
        @Req() req: RequestVigilio
    ) {
        const result = await this.cartApiService.show(
            req.information?.id,
            req.user.id,
            product_id
        );
        return result;
    }

    @PermissionAuth()
    @Validator(cartStoreDto)
    @Status(201)
    @Post("/")
    async store(@Body() body: CartStoreDto, @Req() req: RequestVigilio) {
        const result = await this.cartApiService.store(
            req.information?.id,
            req.user.id,
            body
        );
        return result;
    }

    @PermissionAuth()
    @Pipe(
        objectAsync({
            product_id: string(),
        })
    )
    @Validator(cartUpdateDto)
    @Put("/:product_id")
    async update(
        @Params("product_id") product_id: string,
        @Body() body: CartUpdateDto,
        @Req() req: RequestVigilio
    ) {
        const result = await this.cartApiService.update(
            req.information?.id,
            req.user.id,
            body,
            product_id
        );
        return result;
    }

    @PermissionAuth()
    @Pipe(
        objectAsync({
            product_id: string(),
        })
    )
    @Status(201)
    @Delete("/:product_id")
    async destroy(
        @Params("product_id") product_id: string,
        @Req() req: RequestVigilio
    ) {
        const result = await this.cartApiService.destroy(
            req.information?.id,
            req.user.id,
            product_id
        );
        return result;
    }
}
