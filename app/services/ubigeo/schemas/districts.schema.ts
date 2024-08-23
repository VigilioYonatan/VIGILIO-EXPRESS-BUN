import { type Input, objectAsync, string } from "@vigilio/valibot";
import type { ProvincesSchema } from "./provinces.schema";
import type { DepartmentsSchema } from "./departments.schema";

export const districtsSchema = objectAsync({
	ubigeo: string(),
	name: string(),
	province_id: string(),
	department_id: string(),
});

export type DistrictsSchema = Input<typeof districtsSchema>;
export type DistrictsSchemaEntity = DistrictsSchema & {
	province: ProvincesSchema;
	department: DepartmentsSchema;
};
