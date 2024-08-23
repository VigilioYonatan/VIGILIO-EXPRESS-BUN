import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity } from "~/libs/helpers";
import { Categories } from "../entities/categories.entity";
import type { CategoriesStoreDto } from "../dtos/categories.store.dto";
import type { CategoriesUpdateDto } from "../dtos/categories.update.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class CategoriesApiService {
    async index(information: InformationEntity) {
        const data = await Categories.findAll({
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
        let category = null;
        if (!Number.isNaN(Number(slug))) {
            category = await Categories.findOne({
                where: {
                    id: slug,
                    information_id: information.id,
                },
            });
        } else {
            category = await Categories.findOne({
                where: {
                    slug,
                    information_id: information.id,
                },
            });
        }

        if (!category) throw new NotFoundException("No se encontró categoría");
        return {
            success: true,
            category,
        };
    }

    async store(
        information: InformationEntity,
        categoriesStoreDto: CategoriesStoreDto
    ) {
        const category = new Categories({
            ...categoriesStoreDto,
            information_id: information.id,
        });
        category.category_code = await generateCodeEntity(
            Categories,
            "category_code" as keyof Categories,
            "CAT"
        );

        await category.save();
        return {
            success: true,
            category,
        };
    }

    async update(
        information: InformationEntity,
        id: string,
        categoriesUpdateDto: CategoriesUpdateDto
    ) {
        const { category } = await this.show(information, id);
        const [byName, bySlug] = await Promise.all([
            Categories.findOne({
                where: {
                    name: categoriesUpdateDto.name,
                    information_id: information.id,
                    id: { [Op.not]: id },
                },
                raw: true,
            }),
            Categories.findOne({
                where: {
                    slug: categoriesUpdateDto.slug,
                    information_id: information.id,
                    id: { [Op.not]: id },
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe la categoría con el nombre: ${categoriesUpdateDto.name}`,
                { body: "name" as keyof CategoriesUpdateDto }
            );
        }
        if (bySlug) {
            throw new BadRequestException(
                `Ya existe la categoría con el slug: ${categoriesUpdateDto.slug}`,
                { body: "slug" as keyof CategoriesUpdateDto }
            );
        }
        await category.update(categoriesUpdateDto);

        return {
            success: true,
            category,
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { category } = await this.show(information, id);
        await category.destroy();
        return {
            success: true,
            message: `La categoría con el id: ${id} fue eliminado`,
        };
    }
}
