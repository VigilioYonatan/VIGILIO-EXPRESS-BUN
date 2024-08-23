import {
    type Input,
    getOutput,
    omitAsync,
    getPipeIssues,
} from "@vigilio/valibot";
import { brandsSchema } from "../schemas/brands.schema";
import { Brands } from "../entities/brands.entitiy";

export const brandsStoreDto = omitAsync(
    brandsSchema,
    ["id", "brand_code"],
    [
        async (input) => {
            const [byName, bySlug] = await Promise.all([
                Brands.findOne({
                    where: {
                        name: input.name,
                    },
                    raw: true,
                }),
                Brands.findOne({
                    where: {
                        slug: input.slug,
                    },
                    raw: true,
                }),
            ]);

            if (byName) {
                return getPipeIssues(
                    "name",
                    `Ya existe la marca con el name: ${input.name}`,
                    input
                );
            }
            if (bySlug) {
                return getPipeIssues(
                    "slug",
                    `Ya existe la marca con el slug: ${input.slug}`,
                    input
                );
            }
            return getOutput(input);
        },
    ]
);
export type BrandsStoreDto = Input<typeof brandsStoreDto>;
