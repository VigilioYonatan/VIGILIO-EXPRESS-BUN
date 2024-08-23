import {
	Column,
	DataType,
	Table,
	Model,
	HasMany,
	PrimaryKey,
} from "sequelize-typescript";
import type { DepartmentsSchema } from "../schemas/departments.schema";
import { Provinces } from "./provinces.entity";
import { Districts } from "./districts.entity";

@Table({ timestamps: false })
export class Departments extends Model implements DepartmentsSchema {
	@PrimaryKey
	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	ubigeo: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(255),
	})
	name: string;

	@Column({
		type: DataType.DECIMAL(10, 2),
		defaultValue: 0,
	})
	get priceShipping(): number {
		return Number.parseFloat(
			this.getDataValue("priceShipping" as keyof DepartmentsSchema),
		);
	}

	@Column({
		allowNull: false,
		type: DataType.BOOLEAN,
	})
	enabled: boolean;

	@Column({
		allowNull: false,
		type: DataType.DECIMAL,
	})
	get days(): number {
		return Number.parseFloat(
			this.getDataValue("days" as keyof DepartmentsSchema),
		);
	}
	// relations
	@HasMany(() => Provinces)
	provinces: unknown[];

	@HasMany(() => Districts)
	districts: unknown[];
}
