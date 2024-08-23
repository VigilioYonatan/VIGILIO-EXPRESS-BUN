import {
    BelongsTo,
    Column,
    DataType,
    DefaultScope,
    ForeignKey,
    HasMany,
    HasOne,
    Index,
    Model,
    Table,
} from "sequelize-typescript";
import type { OrdersSchema } from "../schemas/orders.schema";
import { StatusOrders } from "./status_orders.entity";
import { PayMethods } from "./pay_methods.entity";
import { DetailOrders } from "./detail_orders.entity";
import type { PayMethodsSchema } from "../schemas/pay_methods.schema";
import type { StatusOrdersSchema } from "../schemas/status_orders.schema";
import { Invoices } from "./invoices.entity";
import { Notes } from "./notes.entity";
import { Guides } from "./guides.entity";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Districts } from "@/ubigeo/entities/districts.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { Users } from "@/users/entities/users.entity";
import type { UsersSchema } from "@/users/schemas/users.schema";

@DefaultScope(() => ({
    include: [
        {
            model: PayMethods,
            attributes: ["id", "name"] as (keyof PayMethodsSchema)[],
        },
        {
            model: StatusOrders,
            attributes: ["id", "name"] as (keyof StatusOrdersSchema)[],
        },
        { model: Districts },
        {
            model: Users,
            attributes: [
                "id",
                "username",
                "name",
                "lastname",
                "photo",
                "email",
                "role_id",
            ] as (keyof UsersSchema)[],
            as: "seller",
        },
    ],
}))
@Table
export class Orders extends Model implements Omit<OrdersSchema, "id"> {
    @Index
    @Column({
        allowNull: false,
        type: DataType.STRING(100),
    })
    order_code: string;

    @Column({
        type: DataType.STRING(100),
    })
    address: string;

    @Column({
        type: DataType.STRING(20),
    })
    telephone: string;

    @Column({ type: DataType.TEXT })
    description: string | null;

    @Column({ type: DataType.DECIMAL(10, 2) })
    get total() {
        return Number.parseFloat(
            this.getDataValue("total" as keyof OrdersSchema)
        );
    }

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    igv: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    is_pasarela_client: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    pasarela_comision: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: false })
    isDelivery: boolean;

    @Column({ type: DataType.DECIMAL, allowNull: false, defaultValue: 1 })
    get moneyChange() {
        return Number.parseFloat(
            this.getDataValue("moneyChange" as keyof OrdersSchema)
        );
    }

    @Column({ type: DataType.JSON, defaultValue: null })
    pasarela_response: object | null;

    @Column({ type: DataType.JSON, defaultValue: null })
    paypal_response: object;

    @Column({ type: DataType.STRING, defaultValue: null })
    paypal_token: string;

    @Column({
        type: DataType.JSON,
    })
    map_marker: { lng: number; lat: number } | null;

    @Column({
        type: DataType.JSON,
    })
    transferencia_image: FilesSchema[] | null;

    @ForeignKey(() => StatusOrders)
    @Column({ allowNull: false, type: DataType.INTEGER })
    status_order_id: number;

    @ForeignKey(() => Users)
    @Column({ allowNull: false, type: DataType.INTEGER })
    user_id: number;

    @ForeignKey(() => PayMethods)
    @Column({ allowNull: false, type: DataType.INTEGER })
    pay_method_id: number;

    @ForeignKey(() => Districts)
    @Column({ type: DataType.STRING })
    district_id: string | null;

    /*****  RELATIONS   *****/

    // orders - status_order: one to many
    @BelongsTo(() => Districts)
    district: unknown;

    @BelongsTo(() => Users)
    user: unknown;

    // orders - status_order: one to many
    @BelongsTo(() => StatusOrders)
    status_order: unknown;

    // orders - pay_methods: one to many
    @BelongsTo(() => PayMethods)
    pay_method: unknown;

    @HasMany(() => DetailOrders)
    details_orders: unknown[];

    // one to one - order - invoice
    @HasOne(() => Invoices)
    invoice: unknown;

    @HasOne(() => Notes)
    note: unknown;

    @HasOne(() => Guides)
    guide: unknown;

    @ForeignKey(() => InformationEntity)
    @Column({ type: DataType.INTEGER, allowNull: false })
    information_id: number;

    @BelongsTo(() => InformationEntity)
    information: unknown;
}
