import {
    number,
    objectAsync,
    string,
    type Input,
    nullable,
    minLength,
    maxLength,
    custom,
    minValue,
    startsWith,
    boolean,
    object,
    array,
} from "@vigilio/valibot";
import type { DetailOrdersFromServer } from "./detail_orders.schema";
import type { InvoicesSchema } from "./invoices.schema";
import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { ordersTransferenciaImage } from "../libs";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";

export const ordersSchema = objectAsync({
    id: number(),
    order_code: string(),
    address: nullable(string([minLength(10), maxLength(100)])),
    telephone: nullable(
        string([
            minLength(9),
            maxLength(9),
            custom(
                (value) => /^[0-9]+$/.test(value),
                "Este campo permite solo números."
            ),
            startsWith("9", "El numero debe empesar con 9."),
        ])
    ),
    total: number([minValue(0, "Total no válido.")]),
    description: nullable(string([minLength(3), maxLength(255)])),
    status_order_id: number(),
    pay_method_id: number(),
    pasarela_comision: boolean(),
    paypal_token: nullable(string()),
    paypal_response: nullable(object({})),
    pasarela_response: nullable(object({})),
    transferencia_image: nullable(array(filesSchema(ordersTransferenciaImage))),
    isDelivery: boolean(),
    moneyChange: number(),
    igv: boolean(),
    is_pasarela_client: boolean(),
    district_id: nullable(string()),
    map_marker: nullable(
        object({ lng: number(), lat: number() }, "Coordenadas no válida.")
    ),
    information_id: number(),
    user_id: number(),
});

export type OrdersSchema = Input<typeof ordersSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type OrdersSchemaFromServer = OrdersSchema & {
    details_orders: DetailOrdersFromServer[];
    invoice: InvoicesSchema;
    user: Pick<
        UsersSchemaFromServer,
        "id" | "username" | "name" | "lastname" | "photo" | "email" | "role_id"
    >;
};
