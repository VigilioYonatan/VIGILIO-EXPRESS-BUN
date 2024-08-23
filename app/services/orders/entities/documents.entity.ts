import {
	Column,
	DataType,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import type { DocumentsSchema } from "../schemas/documents.schema";
import { Invoices } from "./invoices.entity";
import { Notes } from "./notes.entity";

@Table
export class Documents extends Model implements DocumentsSchema {
	@PrimaryKey
	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	code: string;

	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	name: string;

	@HasMany(() => Invoices)
	invoices: unknown[];

	@HasMany(() => Notes)
	notes: unknown[];
}
