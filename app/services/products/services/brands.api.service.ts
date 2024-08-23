import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity } from "~/libs/helpers";
import type { BrandsStoreDto } from "../dtos/brands.store.dto";
import type { BrandsUpdateDto } from "../dtos/brands.update.dto";
import { Brands } from "../entities/brands.entitiy";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class BrandsApiService {
    async index(information: InformationEntity) {
        const data = await Brands.findAll({
            where: {
                information_id: information.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async show(information: InformationEntity, slug: string) {
        let brand = null;
        if (!Number.isNaN(Number(slug))) {
            brand = await Brands.findOne({
                where: { id: slug, information_id: information.id },
            });
        } else {
            brand = await Brands.findOne({
                where: {
                    slug,
                    information_id: information.id,
                },
            });
        }
        if (!brand) {
            throw new NotFoundException(`No se encontró un marca con ${slug}`);
        }
        return {
            success: true,
            brand,
        };
    }

    async store(
        information: InformationEntity,
        brandsStoreDto: BrandsStoreDto
    ) {
        const brand = new Brands({
            ...brandsStoreDto,
            information_id: information.id,
        });
        brand.brand_code = await generateCodeEntity(
            Brands,
            "brand_code" as keyof Brands,
            "BRAND"
        );
        await brand.save();
        return {
            success: true,
            brand,
        };
    }

    async update(
        information: InformationEntity,
        id: string,
        brandsUpdateDto: BrandsUpdateDto
    ) {
        const { brand } = await this.show(information, id);
        const [byName, bySlug] = await Promise.all([
            Brands.findOne({
                where: {
                    name: brandsUpdateDto.name,
                    id: { [Op.not]: id },
                    information_id: information.id,
                },
                raw: true,
            }),
            Brands.findOne({
                where: {
                    slug: brandsUpdateDto.slug,
                    id: { [Op.not]: id },
                    information_id: information.id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe la marca con el nombre: ${brandsUpdateDto.name}`,
                { body: "name" as keyof BrandsUpdateDto }
            );
        }
        if (bySlug) {
            throw new BadRequestException(
                `Ya existe la marca con el slug: ${brandsUpdateDto.slug}`,
                { body: "slug" as keyof BrandsUpdateDto }
            );
        }
        await brand.update(brandsUpdateDto);

        return {
            success: true,
            brand,
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { brand } = await this.show(information, id);
        const products = await brand.$get("products", { raw: true });
        if (products.length)
            throw new BadRequestException(
                `Existe productos en la marca ${brand.brand_code} - ${products.length} productos`
            );

        await brand.destroy();
        return {
            success: true,
            message: `La marca con el id: ${id} fue eliminado`,
        };
    }
}
