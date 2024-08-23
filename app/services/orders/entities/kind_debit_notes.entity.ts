import {
	Column,
	DataType,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { Notes } from "./notes.entity";
import type { KindDebitNotesSchema } from "../schemas/kind_debit_notes.schema";

@Table({ tableName: "kind_debit_notes" })
export class KindDebitNotes extends Model implements KindDebitNotesSchema {
	@PrimaryKey
	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	code: string;

	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	name: string;

	@HasMany(() => Notes)
	notes: unknown[];
}
