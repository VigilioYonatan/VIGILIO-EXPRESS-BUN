import { nullable } from "@vigilio/valibot";
import {
    type Input,
    number,
    objectAsync,
    string,
    array,
    coerce,
    date,
    boolean,
    minLength,
    minValue,
    maxValue,
    toTrimmed,
    maxLength,
} from "@vigilio/valibot";

export const couponsSchema = objectAsync({
    id: number(),
    coupon: string([toTrimmed(), minLength(6), maxLength(20)]),
    discount: number([
        minValue(0, "Minímo 0%."),
        maxValue(100, "Máximo 100%."),
    ]),
    max_use: number([minValue(0), maxValue(100)]),
    date: coerce(date(), (value) => new Date(value as string)),
    onlyRegister: nullable(boolean()),
    categories: array(number(), [minLength(1)]),
    information_id: number(),
});
export type CouponsSchema = Input<typeof couponsSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
