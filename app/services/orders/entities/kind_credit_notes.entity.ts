import {
	Column,
	DataType,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { Notes } from "./notes.entity";
import type { KindCreditNotesSchema } from "../schemas/kind_credit_notes.schema";

@Table({ tableName: "kind_credit_notes" })
export class KindCreditNotes extends Model implements KindCreditNotesSchema {
	@PrimaryKey
	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	code: string;

	@Column({ type: DataType.STRING(100), allowNull: false, unique: true })
	name: string;

	@HasMany(() => Notes)
	notes: unknown[];
}
