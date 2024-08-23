import { slug } from "@vigilio/express-core/helpers";
import {
    minLength,
    type Input,
    objectAsync,
    number,
    maxLength,
    string,
    transform,
    toTrimmed,
} from "@vigilio/valibot";

export const categoriesSchema = objectAsync({
    id: number(),
    category_code: string([minLength(1), maxLength(30)]),
    name: string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
    slug: transform(
        string([toTrimmed(), minLength(1), minLength(3), maxLength(200)]),
        slug
    ),
    information_id: number(),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
