import { creditCardSchema } from "../schemas/credit-card.schema";
import { yapeSchema } from "../schemas/yape.schema";
import { ordersStoreDto } from "@/orders/dtos/orders.store.dto";
import { type Input, nullable, object, mergeAsync } from "@vigilio/valibot";

export const paymentDto = mergeAsync([
	ordersStoreDto,
	object({
		creditCard: nullable(creditCardSchema),
		yape: nullable(yapeSchema),
	}),
]);
export type PaymentDto = Input<typeof paymentDto>;
