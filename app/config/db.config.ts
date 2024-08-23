import { Sequelize } from "sequelize-typescript";
import enviroments from "./enviroments.config";
import { logger } from "@vigilio/express-core/helpers";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { Users } from "@/users/entities/users.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { Cart } from "@/cart/entites/cart.entity";
import { Address } from "@/information/entities/address.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { Guides } from "@/orders/entities/guides.entity";
import { Invoices } from "@/orders/entities/invoices.entity";
import { KindCreditNotes } from "@/orders/entities/kind_credit_notes.entity";
import { KindDebitNotes } from "@/orders/entities/kind_debit_notes.entity";
import { KindInvoice } from "@/orders/entities/kind_invoice.entity";
import { Notes } from "@/orders/entities/notes.entity";
import { PayMethods } from "@/orders/entities/pay_methods.entity";
import { StatusOrders } from "@/orders/entities/status_orders.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { Categories } from "@/products/entities/categories.entity";
import { Coupons } from "@/products/entities/coupons.entity";
import { Departments } from "@/ubigeo/entities/departments.entity";
import { Districts } from "@/ubigeo/entities/districts.entity";
import { Provinces } from "@/ubigeo/entities/provinces.entity";
import { Notifications } from "@/notificactions/entities/notifications.entity";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import { Documents } from "@/orders/entities/documents.entity";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { Options } from "@/products/entities/options/options.entity";
import { Features } from "@/products/entities/options/features.entity";
import { Variants } from "@/products/entities/options/variants.entity";
import { VariantsFeatures } from "@/products/entities/options/variants_features.entity";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: enviroments.DB_HOST,
    username: enviroments.DB_USER,
    password: enviroments.DB_PASS,
    database: enviroments.DB_NAME,
    port: enviroments.DB_PORT,
    pool: {
        max: 30,
        min: 10,
        acquire: 60000,
        idle: 20000,
    },
});

sequelize.addModels([
    // here entities
    ProductsServicio,
    ProductsNormal,
    ProductsRestaurant,
    InformationEntity,
    Users,
    Cart,
    Address,
    Orders,
    DetailOrders,
    Guides,
    Invoices,
    KindCreditNotes,
    KindDebitNotes,
    KindInvoice,
    Notes,
    PayMethods,
    StatusOrders,
    Brands,
    Categories,
    Coupons,
    Departments,
    Districts,
    Provinces,
    Notifications,
    NotificationsUser,
    Documents,
    ProductsOptions,
    Options,
    Features,
    Variants,
    VariantsFeatures,
]);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        logger.success("conectado a base de datos correctamente");
        if (enviroments.NODE_ENV === "production") return;
        await sequelize.sync({ force: true });
    } catch (error) {
        logger.error(`Error al conectar base de datos: ${error}`);
    }
}
export { sequelize };
