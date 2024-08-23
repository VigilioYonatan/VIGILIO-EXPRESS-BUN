import {
    type Input,
    omitAsync,
    getOutput,
    getPipeIssues,
} from "@vigilio/valibot";
import { Categories } from "../entities/categories.entity";
import {
    productsServicioSchema,
    type ProductsServicioSchema,
} from "../schemas/products_servicios.entity";
import { ProductsServicio } from "../entities/products_servicio.entity";

export const productsServicioStoreDto = omitAsync(
    productsServicioSchema,
    ["id", "product_code"],
    [
        async (input) => {
            const [byName, bySlug, byCategoryId] = await Promise.all([
                ProductsServicio.findOne({
                    where: {
                        name: input.name,
                        information_id: input.information_id,
                    },
                    raw: true,
                }),
                ProductsServicio.findOne({
                    where: {
                        slug: input.slug,
                        information_id: input.information_id,
                    },
                    raw: true,
                }),
                Categories.findOne({
                    where: {
                        id: input.category_id,
                        information_id: input.information_id,
                    },
                }),
            ]);

            if (byName) {
                return getPipeIssues(
                    "name" as keyof ProductsServicioSchema,
                    `Ya existe el producto con el nombre: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof ProductsServicioSchema,
                    `Ya existe el producto con el slug: ${input.slug}`,
                    input
                );
            }
            if (!byCategoryId) {
                return getPipeIssues(
                    "category_id" as keyof ProductsServicioSchema,
                    `No existe la categoría ${input.category_id}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);

export type ProductsServicioStoreDto = Input<typeof productsServicioStoreDto>;
export const productsServicioUpdateDto = omitAsync(productsServicioSchema, [
    "id",
    "product_code",
    "images",
    "information_id",
]);

export type ProductsServicioUpdateDto = Input<typeof productsServicioUpdateDto>;
