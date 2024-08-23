import {
    type Input,
    getOutput,
    omitAsync,
    getPipeIssues,
} from "@vigilio/valibot";
import { categoriesSchema } from "../schemas/categories.schema";
import { Categories } from "../entities/categories.entity";

export const categoriesStoreDto = omitAsync(
    categoriesSchema,
    ["id", "category_code"],
    [
        async (input) => {
            const [byName, bySlug] = await Promise.all([
                Categories.findOne({
                    where: {
                        name: input.name,
                    },
                    raw: true,
                }),
                Categories.findOne({
                    where: {
                        slug: input.slug,
                    },
                    raw: true,
                }),
            ]);

            if (byName) {
                return getPipeIssues(
                    "name",
                    `Ya existe la categoría con el nombre: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug",
                    `Ya existe la categoría con el slug: ${input.slug}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);
export type CategoriesStoreDto = Input<typeof categoriesStoreDto>;
