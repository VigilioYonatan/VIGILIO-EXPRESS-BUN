import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
	DefaultScope,
	PrimaryKey,
	HasOne,
	HasMany,
} from "sequelize-typescript";
import type { DistrictsSchema } from "../schemas/districts.schema";
import { Departments } from "./departments.entity";
import { Provinces } from "./provinces.entity";
import { Address } from "@/information/entities/address.entity";
import { Orders } from "@/orders/entities/orders.entity";

@DefaultScope(() => ({
	include: [{ model: Departments }, { model: Provinces }],
}))
@Table({ timestamps: false })
export class Districts extends Model implements DistrictsSchema {
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

	@ForeignKey(() => Provinces)
	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	province_id: string;

	@ForeignKey(() => Departments)
	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	department_id: string;

	// relations
	@BelongsTo(() => Provinces)
	province: unknown;

	@BelongsTo(() => Departments)
	department: unknown;

	@HasOne(() => Address)
	address: unknown;

	@HasMany(() => Orders)
	orders: unknown[];
}
