import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
    PrimaryKey,
} from "sequelize-typescript";
import type { CartSchema } from "../schemas/cart.schema";
import { Users } from "@/users/entities/users.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { Variants } from "@/products/entities/options/variants.entity";

@Table
export class Cart extends Model implements Omit<CartSchema, "id"> {
    @Column({ type: DataType.INTEGER, allowNull: false })
    quantity: number;

    @Column({ type: DataType.STRING })
    coupon: string | null;

    @PrimaryKey
    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    // product
    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER })
    product_normal_id: number | null;

    @ForeignKey(() => ProductsServicio)
    @Column({ type: DataType.INTEGER })
    product_servicio_id: number | null;

    @ForeignKey(() => ProductsRestaurant)
    @Column({ type: DataType.INTEGER })
    product_restaurant_id: number | null;

    @BelongsTo(() => ProductsNormal)
    product_normal: unknown;

    @BelongsTo(() => ProductsServicio)
    product_servicio: unknown;

    @BelongsTo(() => ProductsRestaurant)
    product_restaurant: unknown;
    // end product
    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;

    /*****     RELATIONS    *****/
    // user - cart :uno a muchos
    @BelongsTo(() => Users)
    user: unknown;

    @PrimaryKey
    @ForeignKey(() => Variants)
    @Column({ type: DataType.INTEGER })
    variant_id: number | null;

    @BelongsTo(() => Variants)
    variant: unknown;
}
