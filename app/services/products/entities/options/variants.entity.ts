import type { VariantsSchema } from "@/products/schemas/options/variants.schema";
import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { VariantsFeatures } from "./variants_features.entity";
import { Features } from "./features.entity";
import { Cart } from "@/cart/entites/cart.entity";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { ProductsNormal } from "../products_normal.entity";
import { ProductsServicio } from "../products_servicio.entity";
import { ProductsRestaurant } from "../products_restaurant.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Variants extends Model implements Omit<VariantsSchema, "id"> {
    @Column({ type: DataType.STRING(100) })
    sku: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    stock: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    ilimit: boolean;

    @Column({ type: DataType.JSON, allowNull: false })
    images: number[];

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

    @HasMany(() => Cart)
    carts: unknown[];

    @HasMany(() => DetailOrders, { onDelete: "SET NULL" })
    detailsOrders: unknown[];

    @BelongsToMany(() => Features, () => VariantsFeatures)
    features: unknown[];

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
