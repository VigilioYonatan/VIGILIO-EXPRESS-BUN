import type { AddressSchema } from "../schemas/address.schema";

export const addressSeeder: Omit<AddressSchema, "id">[] = [
    {
        district_id: "010101",
        codLocal: "0000",
        urbanizacion: "-",
        direccion:
            "MZ D LT 14 - Av. Javier Prado Este 1234, San Isidro - Lima Perú",
        information_id: 1,
    },
];
