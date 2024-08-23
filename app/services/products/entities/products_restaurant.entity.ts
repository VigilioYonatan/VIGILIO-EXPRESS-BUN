import {
    Column,
    DataType,
    Table,
    Model,
    BelongsTo,
    ForeignKey,
    DefaultScope,
    HasMany,
    Index,
} from "sequelize-typescript";
import { Cart } from "@/cart/entites/cart.entity";
import { Categories } from "./categories.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import type { CategoriesSchema } from "../schemas/categories.schema";
import type { ProductsRestaurantSchema } from "../schemas/products_restaurant.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@DefaultScope(() => ({
    include: [
        {
            model: Categories,
            attributes: ["name", "slug"] as (keyof CategoriesSchema)[],
        },
    ],
}))
@Table
export class ProductsRestaurant
    extends Model
    implements Omit<ProductsRestaurantSchema, "id">
{
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(80),
    })
    product_code: string;

    @Index
    @Column({ type: DataType.STRING(255), unique: true })
    name: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    characteristics: { name: string; value: string }[];

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
    })
    get price(): number {
        return Number.parseFloat(
            this.getDataValue("price" as keyof ProductsRestaurantSchema)
        );
    }

    @Column({
        type: DataType.INTEGER,
    })
    earning: number | null;

    @Column({
        type: DataType.DECIMAL(10, 2),
        defaultValue: 0,
    })
    get discount(): number {
        return Number.parseFloat(
            this.getDataValue("discount" as keyof ProductsRestaurantSchema)
        );
    }

    @Column({ type: DataType.INTEGER, allowNull: false })
    stock: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    ilimit: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
    })
    enabled: boolean;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    images: FilesSchema[] | null;

    @Index
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255),
    })
    slug: string;

    @ForeignKey(() => Categories)
    @Column({ type: DataType.INTEGER, allowNull: false })
    category_id: number;

    /*****  RELATIONS *****/
    // products - categorias : uno a muchos
    @BelongsTo(() => Categories)
    category: unknown;

    // products - cart: uno a muchos
    @HasMany(() => Cart)
    carts: unknown[];

    @HasMany(() => DetailOrders, { onDelete: "SET NULL" })
    detailsOrders: unknown[];

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
