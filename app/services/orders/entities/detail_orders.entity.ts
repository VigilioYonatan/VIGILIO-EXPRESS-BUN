import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { DetailOrdersSchema } from "../schemas/detail_orders.schema";
import { Orders } from "./orders.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Variants } from "@/products/entities/options/variants.entity";

@Table({ tableName: "detail_orders" })
export class DetailOrders
    extends Model
    implements Omit<DetailOrdersSchema, "id">
{
    @Column({ allowNull: false, type: DataType.INTEGER })
    quantity: number;

    @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
    get price(): number {
        return Number.parseFloat(
            this.getDataValue("price" as keyof DetailOrdersSchema)
        );
    }

    @Column({ type: DataType.STRING(100) })
    coupon: string | null;

    @ForeignKey(() => Orders)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    order_id: number;

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

    @BelongsTo(() => Orders)
    order: unknown;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;

    @ForeignKey(() => Variants)
    @Column({ type: DataType.INTEGER })
    variant_id: number | null;

    @BelongsTo(() => Variants)
    variant: unknown;
}
