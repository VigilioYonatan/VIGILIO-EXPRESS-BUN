import {
    Column,
    DataType,
    Table,
    Model,
    BelongsTo,
    ForeignKey,
    DefaultScope,
    HasMany,
} from "sequelize-typescript";
import type {
    CompanySchema,
    ContactsSchema,
    Credentials,
    Empresa,
    GroupWhatsapp,
    InformationSchema,
    InteligenceArtificial,
    Payments,
    ScheduleSchema,
    TransferenciaSchema,
    Whatsappconfig,
} from "../schemas/information.schema";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { Address } from "./address.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { Coupons } from "@/products/entities/coupons.entity";
import { Users } from "@/users/entities/users.entity";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { VariantsFeatures } from "@/products/entities/options/variants_features.entity";
import { Brands } from "@/products/entities/brands.entitiy";

@DefaultScope(() => ({ include: [{ model: Address }] }))
@Table({ tableName: "information" })
export class InformationEntity
    extends Model
    implements Omit<InformationSchema, "id">
{
    // auth
    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    name_empresa: string;

    @Column({
        type: DataType.STRING(200),
    })
    email: string;

    @Column({
        type: DataType.JSON,
    })
    payments: Payments;

    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    slug: string;

    @Column({
        type: DataType.STRING(200),
        unique: true,
    })
    token: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(30),
    })
    telephoneFirst: string;

    @Column({
        type: DataType.STRING(30),
    })
    telephoneReclamos: string | null;

    @Column({
        type: DataType.STRING(30),
    })
    telephoneThird: string | null;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    earning: number;

    @Column({
        type: DataType.JSON,
    })
    icon: FilesSchema[] | null;

    @Column({
        type: DataType.JSON,
    })
    logo: FilesSchema[] | null;

    @Column({
        type: DataType.STRING(100),
    })
    facebook: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    tiktok: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    instagram: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    twitter: string | null;

    @Column({
        type: DataType.STRING(100),
    })
    youtube: string | null;

    @Column({
        type: DataType.TEXT,
    })
    about: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    company: CompanySchema;

    @Column({
        type: DataType.JSON,
    })
    certificado: FilesSchema[];

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledBot: boolean;

    @Column({
        type: DataType.JSON,
    })
    credentials: Credentials;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledSendSunat: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledAnimation: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        unique: true,
    })
    dateRelease: Date;

    @Column({
        type: DataType.INTEGER,
    })
    igv: number;

    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    enabled_igv: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledEmailMessage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledSendMessage: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabledClientPayComision: boolean;

    @Column({ type: DataType.BOOLEAN, allowNull: true })
    isOpen: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enabled: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enable_efectivo: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    enable_paypal: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    yearFounded: Date;

    @Column({
        type: DataType.ENUM("normal", "restaurant", "servicio" as Empresa),
        allowNull: false,
    })
    type_empresa: Empresa;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    inteligenceArtificial: InteligenceArtificial;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    map_marker: { lng: number; lat: number };

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    enable_map_marker: boolean;

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    contacts: ContactsSchema[];

    @Column({
        type: DataType.JSON,
        defaultValue: [],
    })
    groupWhatsapp: GroupWhatsapp[];

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    whatsappconfig: Whatsappconfig;

    @Column({
        type: DataType.JSON,
    })
    schedule: ScheduleSchema[];

    @Column({
        type: DataType.JSON,
    })
    transferencias: TransferenciaSchema | null;

    // relations
    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    address_id: number;

    @BelongsTo(() => Address)
    address: unknown;

    @HasMany(() => ProductsNormal)
    products_normal: ProductsNormal[];

    @HasMany(() => ProductsRestaurant)
    products_restaurant: ProductsRestaurant[];

    @HasMany(() => ProductsServicio)
    products_servicio: ProductsServicio[];

    @HasMany(() => Coupons)
    coupons: unknown[];

    @HasMany(() => Users)
    users: unknown[];

    @HasMany(() => ProductsOptions)
    productsOptions: unknown[];

    @HasMany(() => VariantsFeatures)
    variantsFeatures: unknown[];

    @HasMany(() => Brands)
    brands: unknown[];
}
