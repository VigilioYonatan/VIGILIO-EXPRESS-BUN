import type { FeaturesSchema } from "@/products/schemas/options/features.schema";
import {
	BelongsTo,
	BelongsToMany,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import { VariantsFeatures } from "./variants_features.entity";
import { Variants } from "./variants.entity";
import { Options } from "./options.entity";

@Table
export class Features extends Model implements Omit<FeaturesSchema, "id"> {
	@Column({ type: DataType.STRING(100), allowNull: false })
	value: string;

	@Column({ type: DataType.STRING(100), allowNull: false })
	description: string;

	@ForeignKey(() => Options)
	@Column({ type: DataType.INTEGER, allowNull: false })
	option_id: number;

	// Relations:
	@BelongsTo(() => Options)
	option: unknown;

	@BelongsToMany(
		() => Variants,
		() => VariantsFeatures,
	)
	variants: unknown[];
}
