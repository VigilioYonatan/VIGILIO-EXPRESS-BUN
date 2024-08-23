import {
    type Input,
    minLength,
    number,
    string,
    nullable,
    array,
    maxLength,
    objectAsync,
    toTrimmed,
    object,
    boolean,
    minValue,
    maxValue,
} from "@vigilio/valibot";
import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { productsImagesQualities } from "../libs";
import type { CategoriesSchema } from "./categories.schema";
import type { BrandsSchema } from "./brands.schema";
import type { OptionsSchema } from "./options/options.schema";
import type { VariantsSchema } from "./options/variants.schema";
import type { FeaturesSchema } from "./options/features.schema";

export const productsNormalSchema = objectAsync({
    id: number(),
    product_code: string([toTrimmed(), minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(255)]),
    description: nullable(string([toTrimmed()])), // descripcion del producto
    characteristics: array(
        object({
            name: string([toTrimmed(), minLength(1)]),
            value: string([toTrimmed(), minLength(1)]),
        })
    ),
    // isNew: boolean(), // es nuevo el producto
    enabled: boolean(), // esta disponible el producto?
    earning: nullable(number([minValue(0), maxValue(100)])), // ganancia de empresa. si producto cuesta 100soles. ganancia 30% ejemplo. 130soles mostrara. SI ES nullo tomará el 30% de information schema
    price: number([minValue(0)]), // precio
    sku: nullable(string([toTrimmed(), minLength(3), maxLength(45)])),
    stock: nullable(number([minValue(0, "Minimo 0 cantidades.")])),
    ilimit: boolean(),
    discount: number([minValue(0), maxValue(100)]), //si tiene descuento
    slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
    images: nullable(array(filesSchema(productsImagesQualities))),
    isNew: boolean(),
    monthGarantia: nullable(number()),
    category_id: number(),
    brand_id: number(),
    information_id: number(),
});

export type ProductsNormalSchema = Input<typeof productsNormalSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type ProductsNormalSchemaFromServer = ProductsNormalSchema & {
    category: CategoriesSchema;
    brand: Pick<BrandsSchema, "id" | "name">;
    options: (OptionsSchema & { features: FeaturesSchema[] })[];
    variants: (VariantsSchema & {
        features: { option_id: number; feature_id: number }[];
    })[];
};
