import {
    type Input,
    omitAsync,
    getPipeIssues,
    getOutput,
} from "@vigilio/valibot";
import { couponsSchema, type CouponsSchema } from "../schemas/coupons.schema";
import { Coupons } from "../entities/coupons.entity";

export const couponsStoreDto = omitAsync(
    couponsSchema,
    ["id"],
    [
        async (input) => {
            const [byCoupon] = await Promise.all([
                Coupons.findOne({
                    where: {
                        coupon: input.coupon,
                        information_id: input.information_id,
                    },
                    raw: true,
                }),
            ]);

            if (byCoupon) {
                return getPipeIssues(
                    "coupon" as keyof CouponsSchema,
                    `Ya existe el cupon con el nombre: ${input.coupon}`,
                    input
                );
            }

            return getOutput(input);
        },
    ]
);

export type CouponsStoreDto = Input<typeof couponsStoreDto>;
