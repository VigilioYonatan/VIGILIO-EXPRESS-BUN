import { omitAsync, type Input } from "@vigilio/valibot";
import { statusOrdersSchema } from "../schemas/status_orders.schema";

export const statusOrdersStoreDto = omitAsync(statusOrdersSchema, ["id"]);
export type StatusOrdersStoreDto = Input<typeof statusOrdersStoreDto>;
