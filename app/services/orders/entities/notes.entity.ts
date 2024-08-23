import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { NoteResponseSunat, NotesSchema } from "../schemas/notes.schema";
import { Invoices } from "./invoices.entity";
import { Documents } from "./documents.entity";
import { KindInvoice } from "./kind_invoice.entity";
import { KindCreditNotes } from "./kind_credit_notes.entity";
import { KindDebitNotes } from "./kind_debit_notes.entity";
import { Orders } from "./orders.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Notes extends Model implements Omit<NotesSchema, "id"> {
    @ForeignKey(() => KindInvoice)
    @Column({ type: DataType.STRING(10), allowNull: false })
    kind_invoice_code: string;

    @Column({ type: DataType.STRING(10), allowNull: false })
    serie: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    correlativo: string;

    @Column({ type: DataType.STRING(100) })
    razon_social: string | null;

    @ForeignKey(() => Documents)
    @Column({ type: DataType.STRING(10) })
    document_code: string | null;

    @Column({ type: DataType.STRING(100) })
    identification_number: string | null;

    @Column({ type: DataType.BOOLEAN })
    send_sunat: boolean | null;

    @Column({ type: DataType.JSON })
    response_sunat: NoteResponseSunat | null;

    @Column({ type: DataType.STRING(255) })
    description: string | null;

    @Column({ type: DataType.STRING(200) })
    xml_path: string | null;

    @Column({ type: DataType.STRING(200) })
    cdr_path: string | null;

    @ForeignKey(() => KindCreditNotes)
    @Column({ type: DataType.STRING(10) })
    kind_credit_notes_code: string | null;

    @ForeignKey(() => KindDebitNotes)
    @Column({ type: DataType.STRING(10) })
    kind_debit_notes_code: string | null;

    @ForeignKey(() => Invoices)
    @Column({ type: DataType.INTEGER, allowNull: false })
    invoice_id: number;

    @ForeignKey(() => Orders)
    @Column({ type: DataType.INTEGER, allowNull: false })
    order_id: number;

    // one to one - invoice-order
    @BelongsTo(() => Orders)
    order: unknown;

    // one to one - invoice-order
    @BelongsTo(() => Invoices)
    invoice: unknown;

    @BelongsTo(() => KindInvoice)
    kind_invoice: unknown;

    @BelongsTo(() => Documents)
    document: unknown;

    @BelongsTo(() => KindCreditNotes)
    kind_credit_note: unknown;

    @BelongsTo(() => KindDebitNotes)
    kind_debit_note: unknown;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
