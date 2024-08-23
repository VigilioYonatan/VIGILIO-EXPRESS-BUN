import { Column, DataType, Model, Table, Index, ForeignKey, BelongsTo } from "sequelize-typescript";
import type { CouponsSchema } from "../schemas/coupons.schema";
import { InformationEntity } from "@/information/entities/information.entity";

@Table
export class Coupons extends Model implements Omit<CouponsSchema, "id"> {
    @Index
    @Column({ type: DataType.STRING(30), allowNull: false, unique: true })
    coupon: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    discount: number;

    @Column({ type: DataType.DATE, allowNull: false })
    date: Date;

    @Column({ type: DataType.INTEGER, allowNull: false })
    max_use: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    onlyRegister: boolean | null;

    @Column({ type: DataType.JSON, allowNull: false })
    categories: number[];

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
