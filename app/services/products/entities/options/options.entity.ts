import type { OptionsSchema } from "@/products/schemas/options/options.schema";
import {
    BelongsToMany,
    Column,
    DataType,
    HasMany,
    Model,
    Table,
} from "sequelize-typescript";
import { Features } from "./features.entity";
import { ProductsOptions } from "./products_options.entity";
import { ProductsNormal } from "../products_normal.entity";

@Table
export class Options extends Model implements Omit<OptionsSchema, "id"> {
    @Column({ type: DataType.STRING(100), allowNull: false })
    name: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    type: number;

    // Relations:
    @HasMany(() => Features)
    features: unknown[];

    @BelongsToMany(() => ProductsNormal, () => ProductsOptions)
    products: unknown[];
}
