import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    array,
    boolean,
    nullable,
    number,
    object,
    type Input,
} from "@vigilio/valibot";

export const metodosPagoSchema = object({
    enable_efectivo: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    enable_paypal: boolean(), // el cliente venderá por efectivo tambien? osea el cliente podrá pagar cuando recibe el producto
    qrYape: nullable(array(filesSchema())),
    qrPlin: nullable(array(filesSchema())),
    information_id: number(),
});

export type MetodosPagoSchema = Input<typeof metodosPagoSchema>;
