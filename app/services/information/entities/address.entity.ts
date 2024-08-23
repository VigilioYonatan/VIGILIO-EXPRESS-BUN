import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Table,
    Model,
    DefaultScope,
} from "sequelize-typescript";
import type { AddressSchema } from "../schemas/address.schema";
import { Districts } from "@/ubigeo/entities/districts.entity";
import { InformationEntity } from "./information.entity";

@DefaultScope(() => ({ include: [{ model: Districts }] }))
@Table({ timestamps: false })
export class Address extends Model implements Omit<AddressSchema, "id"> {
    @ForeignKey(() => Districts)
    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    district_id: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    urbanizacion: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    direccion: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    codLocal: string;

    // relations
    @BelongsTo(() => Districts)
    district: unknown;

    @ForeignKey(() => InformationEntity)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
