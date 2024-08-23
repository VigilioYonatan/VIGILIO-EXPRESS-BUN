import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasOne,
    Model,
    Table,
} from "sequelize-typescript";
import type {
    InvoiceResponseSunat,
    InvoicesSchema,
} from "../schemas/invoices.schema";
import { Orders } from "./orders.entity";
import { Notes } from "./notes.entity";
import { KindInvoice } from "./kind_invoice.entity";
import { Documents } from "./documents.entity";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Invoices extends Model implements Omit<InvoicesSchema, "id"> {
    @ForeignKey(() => KindInvoice)
    @Column({ type: DataType.STRING(10), allowNull: false })
    kind_invoice_code: string;

    @Column({ type: DataType.STRING(10), allowNull: false })
    serie: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    correlativo: string;

    @Column({ type: DataType.STRING(100), defaultValue: false })
    razon_social: string;

    @ForeignKey(() => Documents)
    @Column({ type: DataType.STRING(10) })
    document_code: string | null;

    @Column({ type: DataType.STRING(100), defaultValue: false })
    identification_number: string | null;

    @Column({ type: DataType.BOOLEAN })
    send_sunat: boolean | null;

    @Column({ type: DataType.JSON })
    response_sunat: InvoiceResponseSunat | null;

    @Column({ type: DataType.STRING(200) })
    xml_path: string | null;

    @Column({ type: DataType.STRING(200) })
    cdr_path: string | null;

    @ForeignKey(() => Orders)
    @Column({ type: DataType.INTEGER, allowNull: false })
    order_id: number;

    // one to one - invoice-order
    @BelongsTo(() => Orders)
    order: unknown;

    @HasOne(() => Notes)
    note: unknown;

    @BelongsTo(() => KindInvoice)
    kind_invoice: unknown;

    @BelongsTo(() => Documents)
    document: unknown;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
