import { omitAsync, type Input } from "@vigilio/valibot";
import { statusOrdersSchema } from "../schemas/status_orders.schema";

export const statusOrdersUpdateDto = omitAsync(statusOrdersSchema, ["id"]);
export type StatusOrdersUpdateDto = Input<typeof statusOrdersUpdateDto>;
