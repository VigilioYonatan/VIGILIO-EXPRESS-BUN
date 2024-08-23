import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import type { GuidesSchema } from "../schemas/guides.schema";
import { Orders } from "./orders.entity";
import type { InvoiceResponseSunat } from "../schemas/invoices.schema";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Guides extends Model implements Omit<GuidesSchema, "id"> {
    @Column({ type: DataType.STRING(10), allowNull: false })
    kind_guide_code: string;

    @Column({ type: DataType.STRING(10), allowNull: false })
    serie: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    correlativo: string;

    @Column({ type: DataType.JSON, allowNull: false })
    destinatario: GuidesSchema["destinatario"];

    @Column({ type: DataType.JSON, allowNull: false })
    datos_envio: GuidesSchema["datos_envio"];

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

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
