import type { DistrictsSchemaEntity } from "@/ubigeo/schemas/districts.schema";
import {
    minLength,
    number,
    objectAsync,
    string,
    toTrimmed,
    type Input,
} from "@vigilio/valibot";

export const addressSchema = objectAsync({
    id: number(),
    district_id: string(),
    urbanizacion: string([toTrimmed(), minLength(1)]),
    direccion: string([toTrimmed(), minLength(1)]),
    codLocal: string([toTrimmed()]),
    information_id: number(),
});
export type AddressSchema = Input<typeof addressSchema>;
export type AddressSchemaEntity = AddressSchema & {
    district: DistrictsSchemaEntity;
};
