import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import type { PayMethodsSchema } from "../schemas/pay_methods.schema";
import { Orders } from "./orders.entity";

@Table({ tableName: "pay_methods" })
export class PayMethods extends Model implements Omit<PayMethodsSchema, "id"> {
	@Column({
		allowNull: false,
		type: DataType.STRING(100),
		unique: true,
	})
	name: string;

	/*****   RELATIONS    *****/
	// order - pay_methods-order:one - to many
	@HasMany(() => Orders)
	orders: unknown[];
}
