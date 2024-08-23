import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
	DefaultScope,
	HasMany,
	PrimaryKey,
} from "sequelize-typescript";
import type { ProvincesSchema } from "../schemas/provinces.schema";
import { Departments } from "./departments.entity";
import { Districts } from "./districts.entity";

@DefaultScope(() => ({ include: [{ model: Departments }] }))
@Table({ timestamps: false })
export class Provinces extends Model implements ProvincesSchema {
	@PrimaryKey
	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	ubigeo: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	name: string;

	@ForeignKey(() => Departments)
	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	department_id: string;

	// relations
	@BelongsTo(() => Departments)
	department: unknown;

	@HasMany(() => Districts)
	districts: unknown[];
}
