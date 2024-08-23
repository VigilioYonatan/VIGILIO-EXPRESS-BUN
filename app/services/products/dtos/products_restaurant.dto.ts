import {
    type Input,
    omitAsync,
    getOutput,
    getPipeIssues,
} from "@vigilio/valibot";
import { Categories } from "../entities/categories.entity";
import { ProductsRestaurant } from "../entities/products_restaurant.entity";
import {
    productsRestaurantSchema,
    type ProductsRestaurantSchema,
} from "../schemas/products_restaurant.entity";

export const productsRestaurantStoreDto = omitAsync(
    productsRestaurantSchema,
    ["id", "product_code"],
    [
        async (input) => {
            const [byName, bySlug, byCategoryId] = await Promise.all([
                ProductsRestaurant.findOne({
                    where: {
                        name: input.name,
                        information_id: input.information_id,
                    },
                    raw: true,
                }),
                ProductsRestaurant.findOne({
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
                    "name" as keyof ProductsRestaurantSchema,
                    `Ya existe el producto con el nombre: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug" as keyof ProductsRestaurantSchema,
                    `Ya existe el producto con el slug: ${input.slug}`,
                    input
                );
            }
            if (!byCategoryId) {
                return getPipeIssues(
                    "category_id" as keyof ProductsRestaurantSchema,
                    `No existe la categoría ${input.category_id}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);

export type ProductsRestaurantStoreDto = Input<
    typeof productsRestaurantStoreDto
>;
export const productsRestaurantUpdateDto = omitAsync(productsRestaurantSchema, [
    "id",
    "product_code",
    "images",
    "information_id",
]);

export type ProductsRestaurantUpdateDto = Input<
    typeof productsRestaurantUpdateDto
>;
