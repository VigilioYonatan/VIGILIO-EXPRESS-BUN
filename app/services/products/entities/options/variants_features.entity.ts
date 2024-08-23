import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { Features } from "./features.entity";
import { Variants } from "./variants.entity";
import type { VariantsfeaturesSchema } from "@/products/schemas/options/variants_features.schema";
import { InformationEntity } from "@/information/entities/information.entity";

@Table({ timestamps: false })
export class VariantsFeatures extends Model implements VariantsfeaturesSchema {
    @ForeignKey(() => Variants)
    @Column({ type: DataType.INTEGER, allowNull: false })
    variant_id: number;

    @ForeignKey(() => Features)
    @Column({ type: DataType.INTEGER, allowNull: false })
    feature_id: number;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
