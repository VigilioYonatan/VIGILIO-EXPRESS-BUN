import {
	type Input,
	mergeAsync,
	omitAsync,
	nullableAsync,
	objectAsync,
	arrayAsync,
} from "@vigilio/valibot";
import { ordersSchema } from "../schemas/orders.schema";
import { detailOrdersStoreDto } from "./detail_orders.store.dto";
import { invoicesStoreDto } from "./invoices.store.dto";

export const ordersStoreDto = mergeAsync([
	omitAsync(ordersSchema, [
		"id",
		"order_code",
		"igv",
		"pasarela_comision",
		"pasarela_response",
		"paypal_response",
		"paypal_token",
		"moneyChange",
		"is_pasarela_client",
	]),
	objectAsync({
		invoice: nullableAsync(
			omitAsync(invoicesStoreDto, [
				"cdr_path",
				"serie",
				"xml_path",
				"order_id",
				"correlativo",
				"response_sunat",
			]),
		),
		details_orders: arrayAsync(omitAsync(detailOrdersStoreDto, ["order_id"])),
	}),
]);
export type OrdersStoreDto = Input<typeof ordersStoreDto>;
