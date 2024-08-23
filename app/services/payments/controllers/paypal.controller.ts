import {
    Body,
    Controller,
    Get,
    Params,
    Post,
    Query,
    Req,
    Res,
} from "@vigilio/express-core";
import { Injectable } from "@vigilio/express-core";
import { PaypalService } from "../services/paypal.service";
import type { Response } from "express";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import {
    ordersStoreDto,
    type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import { objectAsync, string } from "@vigilio/valibot";
import type { RequestVigilio } from "~/config/types";
import type { InformationApiService } from "@/information/services/information.api.service";

@Injectable()
@Controller("/paypal")
export class PaypalController {
    constructor(
        private readonly paypalService: PaypalService,
        private readonly informationApiService: InformationApiService
    ) {}

    @Validator(ordersStoreDto)
    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Post("/api/:slug/order")
    async order(@Params("slug") slug: string, @Body() body: OrdersStoreDto) {
        const result = await this.paypalService.order(slug, body);
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/success")
    async success(
        @Params("slug") slug: string,
        @Query("token") token: string,
        @Res() res: Response,
        @Req() req: RequestVigilio
    ) {
        if (!token) return res.redirect("/");
        try {
            const result = await this.paypalService.success(slug, token, req);
            return res.render("web/payment/paypal/success", result);
        } catch (error) {
            return res.redirect(
                `/paypal/${slug}/failed?message=${(error as Error).message}`
            );
        }
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/cancel")
    async cancel(@Params("slug") slug: string, @Res() res: Response) {
        const { information } = await this.informationApiService.show(slug);
        return res.render("web/payment/paypal/cancel", { information });
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug/failed")
    async failed(
        @Params("slug") slug: string,
        @Res() res: Response,
        @Query("message") message: string
    ) {
        const { information } = await this.informationApiService.show(slug);
        if (!message) return res.redirect("/");
        return res.render("web/payment/paypal/failed", {
            title: "Pago no realizado correctamente",
            message,
            information,
        });
    }
}
