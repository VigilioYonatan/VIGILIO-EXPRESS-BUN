import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Options } from "./options.entity";
import type { ProductsOptionsSchema } from "@/products/schemas/options/products_options.schema";
import { ProductsNormal } from "../products_normal.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table({ timestamps: false })
export class ProductsOptions extends Model implements ProductsOptionsSchema {
    @ForeignKey(() => ProductsNormal)
    @Column({ type: DataType.INTEGER, allowNull: false })
    product_normal_id: number;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @ForeignKey(() => Options)
    @Column({ type: DataType.INTEGER, allowNull: false })
    option_id: number;

    @Column({ type: DataType.JSONB, allowNull: false })
    features: number[];

    @BelongsTo(() => ProductsNormal)
    productsNormal: unknown;

    @BelongsTo(() => Options)
    option: unknown;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
