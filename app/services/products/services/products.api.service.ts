import { Injectable } from "@vigilio/express-core";
import { ProductsNormal } from "../entities/products_normal.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import { generateCodeEntity } from "~/libs/helpers";
import { removeFile } from "@/uploads/libs/helpers";
import { NOW, TimePeru, restarDays } from "~/libs/dayjs";
import { InformationEntity } from "@/information/entities/information.entity";
import { combinacionesVariants, productEntity } from "../libs";
import { Coupons } from "../entities/coupons.entity";
import { ProductsRestaurant } from "../entities/products_restaurant.entity";
import { ProductsServicio } from "../entities/products_servicio.entity";
import type {
    ProductsNormalStoreDto,
    ProductsNormalUpdateDto,
} from "../dtos/products_normal.dto";
import type {
    ProductsRestaurantStoreDto,
    ProductsRestaurantUpdateDto,
} from "../dtos/products_restaurant.dto";
import type {
    ProductsServicioStoreDto,
    ProductsServicioUpdateDto,
} from "../dtos/products_servicio.dto";
import { ProductsOptions } from "../entities/options/products_options.entity";
import { VariantsFeatures } from "../entities/options/variants_features.entity";

@Injectable()
export class ProductsApiService {
    async index() {
        const data = await ProductsNormal.findAll();
        return {
            success: true,
            data,
        };
    }
    async show(information: InformationEntity, slug: string) {
        let product = null;
        if (!Number.isNaN(Number(slug))) {
            product = (await productEntity(information.type_empresa).findOne({
                where: {
                    id: slug,
                    information_id: information.id,
                },
            })) as ProductsNormal | ProductsRestaurant | ProductsServicio;
        } else {
            product = (await productEntity(information.type_empresa).findOne({
                where: {
                    slug,
                    information_id: information.id,
                },
            })) as ProductsNormal | ProductsRestaurant | ProductsServicio;
        }
        if (!product) {
            const message = `No se encontró un producto con ${slug}`;

            throw new NotFoundException(message);
        }
        // if (allProduct) {
        //     product = await getProductAll(product, user, lang);
        // }

        return {
            success: true,
            product,
        };
    }

    async coupon(
        coupon_code: string,
        product_id: string,
        information: InformationEntity
    ) {
        const [{ product }, coupon] = await Promise.all([
            this.show(information, product_id),
            Coupons.findOne({
                where: {
                    coupon: coupon_code,
                    information_id: information.id,
                },
            }),
        ]);
        if (!coupon) {
            throw new BadRequestException("No se encontró cupon.");
        }
        // verificar si cupon del producto existe en el cupon
        const existCoupon = coupon.categories.some(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (tech: any) => tech === product.category_id
        );

        if (!existCoupon) {
            throw new BadRequestException(
                "Este cupón de descuento no es válido para esta compra"
            );
        }

        if (restarDays(NOW().toDate(), TimePeru(coupon.date).toDate()) <= 0)
            throw new BadRequestException(
                "Lastimosamente, Este cupón de descuento ya se ha vencido"
            );

        if (coupon.max_use! < 1) {
            throw new BadRequestException(
                "Lastimosamente, Este cupón ya no está disponible por limite de uso."
            );
        }

        return {
            success: true,
            discount: coupon.discount,
            limit: coupon.max_use,
            coupon,
        };
    }

    async store(
        information: InformationEntity,
        productsStoreDto:
            | ProductsNormalStoreDto
            | ProductsServicioStoreDto
            | ProductsRestaurantStoreDto
    ) {
        const Product = productEntity(information.type_empresa);
        const product = new Product({
            ...productsStoreDto,
            information_id: information.id,
        });
        product!.product_code = await generateCodeEntity(
            Product,
            "product_code",
            "PROD"
        );
        await product!.save();
        if (information.type_empresa === "normal") {
            await Promise.all(
                (productsStoreDto as ProductsNormalStoreDto).options.map(
                    async (option) => {
                        await ProductsOptions.create({
                            product_id: product.id,
                            ...option,
                        });
                    }
                )
            );
            const combinaciones = combinacionesVariants(
                (productsStoreDto as ProductsNormalStoreDto).options.map(
                    (opt) => opt.features
                )
            );
            await Promise.all(
                combinaciones.map(async (combinacion) => {
                    if (combinacion.length) {
                        const variant = await product.$create("variant", {
                            sku: null,
                            stock: 0,
                            ilimit: false,
                            images: [],
                        });
                        await Promise.all(
                            combinacion.map(async (comb) => {
                                await VariantsFeatures.create({
                                    variant_id: variant.id,
                                    feature_id: comb,
                                });
                            })
                        );
                    }
                })
            );
        }
        return {
            success: true,
            product,
        };
    }

    async update(
        information: InformationEntity,
        id: string,
        productsUpdateDto:
            | ProductsNormalUpdateDto
            | ProductsServicioUpdateDto
            | ProductsRestaurantUpdateDto
    ) {
        const { product } = await this.show(information, id);
        const Product = productEntity(information.type_empresa);
        const [byName, bySlug] = await Promise.all([
            Product.findOne({
                where: {
                    name: productsUpdateDto.name,
                    id: { [Op.not]: id },
                    information_id: information.id,
                },
                raw: true,
            }),
            Product.findOne({
                where: {
                    slug: productsUpdateDto.slug,
                    id: { [Op.not]: id },
                    information_id: information.id,
                },
                raw: true,
            }),
        ]);
        if (byName) {
            throw new BadRequestException(
                `Ya existe el producto con el nombre: ${productsUpdateDto.name}`,
                { body: "name" }
            );
        }

        if (bySlug) {
            throw new BadRequestException(
                `Ya existe el producto con el slug: ${productsUpdateDto.slug}`,
                { body: "slug" }
            );
        }
        await product.update({
            ...productsUpdateDto,
            information_id: information.id,
        });

        return {
            success: true,
            product,
        };
    }

    async destroy(information: InformationEntity, id: string) {
        const { product } = await this.show(information, id);
        await product.destroy();
        if (product.images) {
            removeFile(product.images);
        }
        return {
            success: true,
            message: `El producto con el id: ${id} fue eliminado`,
        };
    }
}
