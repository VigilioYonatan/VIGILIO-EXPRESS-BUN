import { Injectable, NotFoundException } from "@vigilio/express-core";
import { BadRequestException } from "@vigilio/express-core";
import { OrdersApiService } from "@/orders/services/orders.api.service";
import { Orders } from "@/orders/entities/orders.entity";
import { STATUSORDER } from "@/orders/libs";
import enviroments from "~/config/enviroments.config";
import { paypal } from "@vigilio/payments";
import { paypalComision } from "../libs";
import { InformationApiService } from "@/information/services/information.api.service";
import { converterMoneyApi } from "~/libs/apis";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";
import type { OrdersUpdateDto } from "@/orders/dtos/orders.update.dto";
import type { RequestVigilio } from "~/config/types";

@Injectable()
export class PaypalService {
    constructor(
        private readonly ordersApiService: OrdersApiService,
        private readonly informationApiService: InformationApiService
    ) {}
    async order(slug: string, body: OrdersStoreDto) {
        const response = await converterMoneyApi({
            amount: "1",
            from: "PEN",
            to: "USD",
        });
        const { information } = await this.informationApiService.show(slug);
        const value = Number.parseFloat(response.result.todayNumber); // its necesary to fix
        const total = information.enabledClientPayComision
            ? paypalComision(body.total, value).toFixed(2)
            : (body.total / value).toFixed(2);
        const { createOrder } = paypal({
            client_id: information.credentials.paypal.PAYPAL_CLIENT_ID,
            secret_key: information.credentials.paypal.PAYPAL_SECRET_KEY,
            sandbox: enviroments.PAYPAL_SANDBOX,
        });
        const result = await createOrder({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total,
                    },
                },
            ],
            application_context: {
                brand_name: information!.name_empresa,
                // payment_method: "IMMEDIATE_PAYMENT_REQUIRED",
                // locale: "en-US",
                landing_page: "NO_PREFERENCE",
                // shipping_preference: "SET_PROVIDED_ADDRESS",
                user_action: "PAY_NOW",
                return_url: `${enviroments.VITE_URL}/paypal/${information.slug}/success`,
                cancel_url: `${enviroments.VITE_URL}/paypal/${information.slug}/cancel`,
            },
        });

        if (result.status !== "CREATED")
            throw new BadRequestException(
                "Hubo un problema al realizar esta orden. Intentalo de nuevo más tarde."
            );

        await this.ordersApiService.store(
            {
                ...body,
                paypal_token: result.id,
                status_order_id: STATUSORDER.pendiente,
            } as OrdersStoreDto,
            information,
            value
        );

        return { success: true, result };
    }
    async success(slug: string, token: string, req: RequestVigilio) {
        const { information } = await this.informationApiService.show(slug);
        const order = await Orders.findOne({
            where: {
                paypal_token: token,
            },
        });
        if (!order) throw new NotFoundException("Orden no encontrado.");
        let result = null;
        try {
            const { captureOrder } = paypal({
                client_id: information.credentials.paypal.PAYPAL_CLIENT_ID,
                secret_key: information.credentials.paypal.PAYPAL_SECRET_KEY,
                sandbox: enviroments.PAYPAL_SANDBOX,
            });
            result = await captureOrder(token);
            if (!result.status || result.status !== "COMPLETED") {
                throw new Error(
                    result.details[0].description ??
                        "No se realizó el pago correctamente."
                );
            }
        } catch (error) {
            if (order.status_order_id !== STATUSORDER.pagado) {
                await order.update({
                    status_order_id: STATUSORDER.problema,
                    paypal_response: (error as Error).message,
                    description: (error as Error).message,
                });
            }
            throw new Error((error as Error).message);
        }
        const { order: orderShow } = await this.ordersApiService.show(
            information,
            order.order_code
        );
        await this.ordersApiService.update({
            order_code: order.order_code,
            ordersUpdateDto: {
                ...orderShow.toJSON(),
                status_order_id: STATUSORDER.pagado,
                note: null,
                send_message: information.enabledSendMessage, // enviar mensaje a whatsapp
                invoice: {
                    ...orderShow.dataValues.invoice.toJSON(),
                    sendMessage: true,
                    send_sunat: information.enabledSendSunat, // enviar a sunat
                },
                paypal_response: result,
                description: "Pago realizado correctamente",
            } as OrdersUpdateDto,
            req,
        });

        // aca el pago realizado
        return {
            title: "Pago realizado correctamente.",
            order,
        };
    }

    async failed() {}
}
