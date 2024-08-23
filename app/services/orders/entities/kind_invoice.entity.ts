import {
	Column,
	DataType,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import type { KindInvoiceSchema } from "../schemas/kind_invoice.schema";
import { Invoices } from "./invoices.entity";
import { Notes } from "./notes.entity";

@Table({ tableName: "kind_invoice" })
export class KindInvoice extends Model implements KindInvoiceSchema {
	@PrimaryKey
	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	code: string;

	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	name: string;

	@HasMany(() => Invoices)
	invoices: unknown;

	@HasMany(() => Notes)
	notes: unknown;
}
