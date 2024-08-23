import { Information, Injectable } from "@vigilio/express-core";
import { OrdersApiService } from "../services/orders.api.service";
import {
    Body,
    Controller,
    Get,
    Params,
    Post,
    Put,
    Query,
    Req,
    Res,
    Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { type OrdersStoreDto, ordersStoreDto } from "../dtos/orders.store.dto";
import {
    type OrdersUpdateDto,
    ordersUpdateDto,
} from "../dtos/orders.update.dto";
import { objectAsync, string } from "@vigilio/valibot";
import type { Request, Response } from "express";
import type { InformationEntity } from "@/information/entities/information.entity";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";

@Injectable()
@Controller("/orders")
export class OrdersApiController {
    constructor(private readonly ordersApiService: OrdersApiService) {}

    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.ordersApiService.index(information);
        return result;
    }

    @Pipe(
        objectAsync({
            year: string(),
            month: string(),
        })
    )
    @Get("/earning/:year/:month")
    async earningMonth(
        @Params("year") year: string,
        @Params("month") month: string,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.ordersApiService.earningMonth(
            information,
            year,
            month
        );
        return result;
    }

    @Pipe(
        objectAsync({
            order_code: string(),
        })
    )
    @Get("/:order_code")
    async show(
        @Params("order_code") order_code: string,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.ordersApiService.show(
            information,
            order_code
        );
        return result;
    }
    @Pipe(
        objectAsync({
            order_code: string(),
        })
    )
    @Get("/:order_code/pdf")
    async pdf(
        @Params("order_code") order_code: string,
        @Information() information: InformationEntity,
        @Res() res: Response,
        @Query("type") type: "invoice" | "note" | "guide"
    ) {
        const result = await this.ordersApiService.pdf(
            order_code,
            type,
            information
        );
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${result.file}`
        );
        res.send(result.pdfBuffer);
    }

    @Validator(ordersStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Body() body: OrdersStoreDto,
        @Information() information: InformationEntity
    ) {
        const result = await this.ordersApiService.store(body, information);
        return result;
    }
    @Pipe(
        objectAsync({
            order_code: string(),
        })
    )
    @Get("/:order_code/html")
    async html(
        @Params("order_code") order_code: string,
        @Information() information: InformationEntity,
        @Query("type") type: "invoice" | "note" | "guide"
    ) {
        const result = await this.ordersApiService.html(
            order_code,
            type,
            information
        );
        return result;
    }
    @PermissionAuth()
    @Pipe(
        objectAsync({
            order_code: string(),
        })
    )
    @Validator(ordersUpdateDto)
    @Status(201)
    @Put("/:order_code")
    async update(
        @Params("order_code") order_code: string,
        @Body() body: OrdersUpdateDto,
        @Req() req: Request
    ) {
        const result = await this.ordersApiService.update({
            order_code,
            ordersUpdateDto: body,
            req,
        });
        return result;
    }
}
