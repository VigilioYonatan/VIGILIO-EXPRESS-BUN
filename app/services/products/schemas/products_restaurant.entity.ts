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

export const productsRestaurantSchema = objectAsync({
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
    enabled: boolean(), // esta disponible el producto?
    earning: nullable(number([minValue(0), maxValue(100)])), // ganancia de empresa. si producto cuesta 100soles. ganancia 30% ejemplo. 130soles mostrara. SI ES nullo tomará el 30% de information schema
    price: number([minValue(0)]), // precio
    stock: nullable(number([minValue(0, "Minimo 0 cantidades.")])),
    ilimit: boolean(),
    discount: number([minValue(0), maxValue(100)]), //si tiene descuento
    slug: string([minLength(1), minLength(3), maxLength(255)]), // slug
    images: nullable(array(filesSchema(productsImagesQualities))),
    category_id: number(),
    information_id: number(),
});

export type ProductsRestaurantSchema = Input<
    typeof productsRestaurantSchema
> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type ProductsSchemaFromServer = ProductsRestaurantSchema & {
    category: CategoriesSchema;
};
