import {
    omitAsync,
    type Input,
    mergeAsync,
    objectAsync,
    nullableAsync,
    boolean,
} from "@vigilio/valibot";
import { ordersSchema } from "../schemas/orders.schema";
import { notesStoreDto } from "./notes.store.dto";
import { invoicesStoreDto } from "./invoices.store.dto";
import { guidesStoreDto } from "./guides.store.dto";

export const ordersUpdateDto = mergeAsync([
    omitAsync(ordersSchema, [
        "id",
        "order_code",
        "user_id",
        "total",
        "igv",
        "pasarela_comision",
        "paypal_token",
        "paypal_response",
        "pasarela_response",
        "moneyChange",
        "is_pasarela_client",
    ]),
    objectAsync({
        invoice: nullableAsync(
            omitAsync(invoicesStoreDto, [
                "cdr_path",
                "xml_path",
                "order_id",
                "response_sunat",
            ])
        ),
        note: nullableAsync(
            omitAsync(notesStoreDto, [
                "cdr_path",
                "xml_path",
                "invoice_id",
                "order_id",
                "response_sunat",
            ])
        ),
        guide: nullableAsync(
            omitAsync(guidesStoreDto, [
                "cdr_path",
                "xml_path",
                "order_id",
                "response_sunat",
            ])
        ),
        send_message: boolean("Este campo es obligatorio."),
    }),
]);
export type OrdersUpdateDto = Input<typeof ordersUpdateDto>;
