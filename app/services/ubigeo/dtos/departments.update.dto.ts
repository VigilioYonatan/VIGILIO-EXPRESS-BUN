import { pickAsync, type Input } from "@vigilio/valibot";
import { departmentsSchema } from "../schemas/departments.schema";
export const departmentsUpdateDto = pickAsync(departmentsSchema, [
	"priceShipping",
]);
export type DepartmentsUpdateDto = Input<typeof departmentsUpdateDto>;
