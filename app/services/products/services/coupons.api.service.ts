import { Injectable } from "@vigilio/express-core";
import { Coupons } from "../entities/coupons.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import type { CouponsUpdateDto } from "../dtos/coupons.update.dto";
import type { CouponsStoreDto } from "../dtos/coupons.store.dto";
import { CategoriesApiService } from "./categories.api.service";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class CouponsApiService {
    constructor(private readonly categoriesApiService: CategoriesApiService) {}
    async index(information: InformationEntity) {
        const data = await Coupons.findAll({
            where: {
                information_id: information.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(information: InformationEntity, cupon: string) {
        let coupon = null;
        if (!Number.isNaN(Number(cupon))) {
            coupon = await Coupons.findOne({
                where: {
                    id: coupon,
                    information_id: information.id,
                },
            });
        } else {
            coupon = await Coupons.findOne({
                where: {
                    coupon: cupon,
                    information_id: information.id,
                },
            });
        }
        if (!coupon) {
            throw new NotFoundException(`No se encontró un cupón con ${cupon}`);
        }
        const couponMapped = await Promise.all(
            coupon.categories.map(async (coupon) => {
                const { category } = await this.categoriesApiService.show(
                    information,
                    String(coupon)
                );
                return {
                    id: category.id,
                    name: category.name,
                };
            })
        );
        coupon.dataValues.category = couponMapped;
        return {
            success: true,
            coupon,
        };
    }

    async store(
        information: InformationEntity,
        couponsStoreDto: CouponsStoreDto
    ) {
        const coupon = new Coupons({
            ...couponsStoreDto,
            information_id: information.id,
        });
        await coupon.save();
        return {
            success: true,
            coupon,
        };
    }

    async update(
        information: InformationEntity,
        id: string,
        couponsUpdateDto: CouponsUpdateDto
    ) {
        const { coupon } = await this.show(information, id);
        const [byCoupon] = await Promise.all([
            Coupons.findOne({
                where: {
                    coupon: couponsUpdateDto.coupon,
                    id: { [Op.not]: id },
                    information_id: information.id,
                },
                raw: true,
            }),
        ]);
        if (byCoupon) {
            throw new BadRequestException(
                `Ya existe el cúpon: ${couponsUpdateDto.coupon}`,
                { body: "coupon" as keyof CouponsUpdateDto }
            );
        }

        await coupon.update(couponsUpdateDto);
        return {
            success: true,
            coupon,
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { coupon } = await this.show(information, id);
        await coupon.destroy();
        return {
            success: true,
            message: `El coupon con el id: ${id} fue eliminado`,
        };
    }
}
