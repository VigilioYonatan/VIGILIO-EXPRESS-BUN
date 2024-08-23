import {
    number,
    objectAsync,
    string,
    type Input,
    nullable,
    boolean,
    object,
} from "@vigilio/valibot";

export const invoiceResponseSunat = object({
    cdrResponse: object({ code: number(), description: string() }),
    error: nullable(object({ code: string(), message: string() })),
});
export type InvoiceResponseSunat = Input<typeof invoiceResponseSunat>;

export const invoicesSchema = objectAsync({
    id: number(),
    serie: string(),
    correlativo: string(),
    kind_invoice_code: string(),
    document_code: nullable(string("Documento no válido")),
    identification_number: nullable(string("Documento de identidad no válido")),
    razon_social: nullable(string("Razón social no válido")),
    send_sunat: nullable(boolean()),
    response_sunat: nullable(invoiceResponseSunat),
    xml_path: nullable(string()),
    cdr_path: nullable(string()),
    order_id: number(),
    information_id: number(),
});

export type InvoicesSchema = Input<typeof invoicesSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
