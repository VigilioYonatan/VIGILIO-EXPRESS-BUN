import {
    Column,
    DataType,
    Table,
    Model,
    HasMany,
    Index,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { CategoriesSchema } from "../schemas/categories.schema";
import { InformationEntity } from "@/information/entities/information.entity";
import { ProductsRestaurant } from "./products_restaurant.entity";
import { ProductsServicio } from "./products_servicio.entity";

@Table
export class Categories extends Model implements Omit<CategoriesSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    category_code: string;

    @Index
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255),
    })
    name: string;

    @Index
    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255),
    })
    slug: string;

    // products - subcategories : uno a muchos
    @HasMany(() => ProductsNormal)
    productsNormals: unknown[];

    @HasMany(() => ProductsRestaurant)
    productsRestaurants: unknown[];

    @HasMany(() => ProductsServicio)
    productsServicio: unknown[];

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
