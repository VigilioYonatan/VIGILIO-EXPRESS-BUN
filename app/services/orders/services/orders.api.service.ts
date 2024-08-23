import { Injectable } from "@vigilio/express-core";
import { Orders } from "../entities/orders.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { delay, generateCodeEntity } from "~/libs/helpers";
import type { OrdersUpdateDto } from "../dtos/orders.update.dto";
import { InvoicesApiService } from "./invoices.api.service";
import {
    STATUSORDER,
    crdGenerate,
    getOrder,
    onGuideSunat,
    onInvoiceSunat,
    onNoteSunat,
    pdfGenerate,
    xmlGenerate,
} from "../libs";
import type { Request } from "express";
import { invoiceSendSunatApi } from "../sunat/invoice.send.api";
import { DetailOrdersApiService } from "./detail_orders.api.service";
import { Invoices } from "../entities/invoices.entity";
import { NotesApiService } from "./notes.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { formatMoney, subtotal, subtotalIgv } from "@/cart/libs/helpers";
import type { OrdersStoreDto } from "../dtos/orders.store.dto";
import { Op, type WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { GuidesApiService } from "./guides.api.service";
import { DetailOrders } from "../entities/detail_orders.entity";
import { MessageMedia } from "whatsapp-web.js";
import type { Notes } from "../entities/notes.entity";
import { noteSendSunatApi } from "../sunat/note.send.api";
import enviroments from "~/config/enviroments.config";
import { invoicePDFSunatApi } from "../sunat/invoice.pdf.api";
import type { SunatInvoiceDto } from "../sunat/dtos/sunat.invoice.dto";
import { NOW, TimePeru, formatTime, restarDays } from "~/libs/dayjs";
import type { InvoiceResponseSunat } from "../schemas/invoices.schema";
import type { NoteResponseSunat } from "../schemas/notes.schema";
import type { InformationEntity } from "@/information/entities/information.entity";
import { guideSendSunatApi } from "../sunat/guide.send.api";
import { notePDFSunatApi } from "../sunat/note.pdf.api";
import { UbigeoApiService } from "@/ubigeo/services/ubigeo.api.service";
import type { SunatNoteDto } from "../sunat/dtos/sunat.note.dto";
import type { Provinces } from "@/ubigeo/entities/provinces.entity";
import type { Departments } from "@/ubigeo/entities/departments.entity";
import type { SunatGuideDto } from "../sunat/dtos/sunat.guide.dto";
import { guidePDFSunatApi } from "../sunat/guide.pdf.api";
import type { Users } from "@/users/entities/users.entity";
import { productEntity, productEntityId } from "../../products/libs/index";
import { clients } from "@/bot/libs/ai";
import type { RequestVigilio } from "~/config/types";
import type { Variants } from "@/products/entities/options/variants.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";

@Injectable()
export class OrdersApiService {
    constructor(
        private readonly productsApiService: ProductsApiService,
        private readonly invoicesApiService: InvoicesApiService,
        private readonly notesApiService: NotesApiService,
        private readonly guidesApiService: GuidesApiService,
        private readonly detailOrdersApiService: DetailOrdersApiService,
        private readonly ubigeoApiService: UbigeoApiService
    ) {}

    async index(information: InformationEntity) {
        const data = await Orders.findAll({
            where: {
                information_id: information.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async earningMonth(
        information: InformationEntity,
        year: string,
        month: string
    ) {
        const startDate = new Date(Number(year), Number(month) - 1, 1); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11

        // Luego, calculamos la fecha de fin del mes
        const endDate = new Date(Number(year), Number(month), 0); // Usamos el día 0 del mes siguiente para obtener el último día del mes actual

        const where: WhereOptions = {
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
        };
        const [
            earning,
            ordersTotal,
            ordersTotalPay,
            ordersTotalError,
            orderDelivery,
            orderLocal,
            detailOrders,
            mostUser,
            rating,
        ] = await Promise.all([
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    ...where,
                    status_order_id: STATUSORDER.entregado,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    status_order_id: STATUSORDER.pagado,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    status_order_id: STATUSORDER.problema,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    isDelivery: true,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    isDelivery: false,
                },
            }),
            DetailOrders.unscoped().findAll({
                where,
            }),
            Orders.unscoped().findAll({
                attributes: [
                    "user_id",
                    [Sequelize.fn("COUNT", "user_id"), "order_count"],
                ],
                group: ["user_id"],
                order: [[Sequelize.literal("order_count"), "DESC"]],
                limit: 1,
                raw: true, // Obtener resultados como objetos JSON planos
                where,
            }),
            Orders.unscoped().findAll({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                    [Sequelize.fn("DATE", Sequelize.col("createdAt")), "time"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    ...where,
                },
                group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
            }),
        ]);

        const orders = {
            ganancias: earning ? earning.total : 0,
            ordersTotal,
            ordersTotalPay,
            ordersTotalError,
            orderDelivery,
            orderLocal,
            mostUser,
        };
        const productsMost = await detailOrders.reduce(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (acc: any, order: any) => {
                const productId =
                    order[productEntityId(information.type_empresa)];
                acc[productId] = (acc[productId] || 0) + 1;
                return acc;
            },
            {}
        );
        const topThreeProductIds = await Promise.all(
            Object.keys(productsMost)
                .sort((a, b) => productsMost[b] - productsMost[a])
                .slice(0, 3)
                .map(async (ord) => {
                    const { product } = await this.productsApiService.show(
                        information,
                        ord
                    );
                    return {
                        id: product.id,
                        name: product.name,
                        image: product.images,
                    };
                })
        );
        const ratingArray = rating.map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (res: { get: (arg0: string) => any }) => ({
                value: res.get("total"),
                time: res.get("time"),
            })
        );
        return {
            success: true,
            results: {
                orders,
                topThreeProductIds,
                ratingArray,
            },
        };
    }

    async show(information: InformationEntity, order_code: string) {
        let order = await Orders.findOne({
            where: { order_code, information_id: information.id },
        });
        if (!order) {
            throw new NotFoundException(
                `No se encontró un orden con ${order_code}`
            );
        }
        order = await getOrder(information, order);

        return {
            success: true,
            order,
        };
    }
    // imprimir pdf
    async pdf(
        order_code: string,
        type: "note" | "invoice" | "guide",
        information: InformationEntity
    ) {
        const { order } = await this.show(information, order_code);
        if (!["note", "invoice", "guide"].includes(type))
            throw new BadRequestException("Solo note, guide o invoice");

        let sunat: null | SunatInvoiceDto | SunatGuideDto = null;
        const vendedor = `${(order.user as Users)?.name ?? ""} ${
            (order.user as Users)?.lastname ?? ""
        }`;

        if (order.dataValues.invoice && type === "invoice") {
            sunat = await onInvoiceSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                invoice: order.dataValues.invoice as Invoices,
                order,
                vendedor,
            });
        }
        if (order.dataValues.note && type === "note") {
            sunat = await onNoteSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                note: order.dataValues.note,
                order,
                invoice: order.dataValues.invoice,
                vendedor,
            });
        }

        if (order.dataValues.guide && type === "guide") {
            sunat = await onGuideSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                order,
                vendedor,
                guide: order.dataValues.guide,
            });
        }
        if (!sunat) throw new BadRequestException("No hubo nota o comprobante");
        const typePDF =
            type === "invoice"
                ? (order.dataValues.invoice as Invoices).kind_invoice_code ===
                      "01" ||
                  (order.dataValues.invoice as Invoices).kind_invoice_code ===
                      "03"
                    ? "invoice"
                    : "ticket"
                : type === "note"
                ? "note"
                : "guide";

        const result = await pdfGenerate({
            information,
            sunat,
            order,
            type: typePDF,
        });

        return result;
    }
    async html(
        order_code: string,
        type: "note" | "invoice" | "guide",
        information: InformationEntity
    ) {
        const { order } = await this.show(information, order_code);
        if (!["note", "invoice", "guide"].includes(type))
            throw new BadRequestException("Solo note, guide o invoice");
        const vendedor = `${(order.user as Users)?.name ?? ""} ${
            (order.user as Users)?.lastname ?? ""
        }`;
        let sunat: null | SunatInvoiceDto | SunatGuideDto = null;
        let stringHTML = "";

        if (order.dataValues.invoice && type === "invoice") {
            sunat = await onInvoiceSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                invoice: order.dataValues.invoice as Invoices,
                order,
                vendedor,
            });
            stringHTML = await invoicePDFSunatApi(sunat as SunatInvoiceDto);
        }
        if (order.dataValues.note && type === "note") {
            sunat = await onNoteSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                note: order.dataValues.note,
                order,
                invoice: order.dataValues.invoice,
                vendedor,
            });
            stringHTML = await notePDFSunatApi(sunat as SunatNoteDto);
        }
        if (order.dataValues.guide && type === "guide") {
            sunat = await onGuideSunat({
                detail_orders: order.dataValues.details_orders,
                information,
                order,
                vendedor,
                guide: order.dataValues.guide,
            });

            stringHTML = await guidePDFSunatApi(sunat as SunatGuideDto);
        }

        if (!sunat) throw new BadRequestException("No hubo nota o comprobante");
        return stringHTML;
    }

    // agregar orden
    async store(
        ordersStoreDto: OrdersStoreDto,
        information: InformationEntity,
        moneyConverter = 1,
        comision?: {
            pasarela_comision?: boolean;
        } // to diference paypal o pasarela
    ) {
        const { invoice, details_orders, ...rest } = ordersStoreDto;

        const { pasarela_comision = false } = comision || {
            pasarela_comision: false,
        };

        if (!information?.enabled || !information.isOpen)
            throw new BadRequestException(information.whatsappconfig.enabled);
        const findDay = information.schedule.find(
            (day) => day.id === NOW().day()
        );

        if (
            NOW().isAfter(formatTime(findDay!.openTime)) &&
            NOW().isBefore(formatTime(findDay!.closeTime))
        ) {
        } else {
            throw new BadRequestException(information.whatsappconfig.cerrado);
        }

        const detailsOrder = await Promise.all(
            details_orders.map(async (detail_order) => {
                const productId = String(
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (detail_order as any)[
                        productEntityId(information.type_empresa)
                    ]
                );
                const { product } = await this.productsApiService.show(
                    information,
                    productId
                );

                let sub = subtotalIgv(information, product);
                if (information.type_empresa === "normal") {
                    // encontrar variant
                    const variant = (
                        product.dataValues.variants as Variants[]
                    ).find((variant) => variant.id === detail_order.variant_id);
                    let sub = subtotalIgv(information, product);
                    if (
                        !variant ||
                        !product?.enabled ||
                        (!variant.ilimit && variant.stock! < 1) ||
                        (!variant.ilimit &&
                            variant.stock! < detail_order.quantity)
                    ) {
                        throw new BadRequestException(
                            `Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(
                                0,
                                13
                            )}-${variant?.sku}..., ${
                                !product?.enabled ? "No disponible" : ""
                            } ${variant?.stock! < 1 ? "Se acabó stock" : ""}`
                        );
                    }
                    if (detail_order.coupon) {
                        const { discount } =
                            await this.productsApiService.coupon(
                                detail_order.coupon,
                                String(
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    (detail_order as any)[
                                        productEntityId(
                                            information.type_empresa
                                        )
                                    ]
                                ),
                                information
                            );
                        sub = subtotal(sub, discount);
                    }
                } else {
                    const producto = product as
                        | ProductsRestaurant
                        | ProductsServicio;
                    if (producto instanceof ProductsRestaurant) {
                        if (
                            !producto ||
                            !producto?.enabled ||
                            (!producto.ilimit && producto.stock! < 1) ||
                            (!producto.ilimit &&
                                producto.stock! < detail_order.quantity)
                        ) {
                            throw new BadRequestException(
                                `Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(
                                    0,
                                    13
                                )}..., ${
                                    !producto?.enabled ? "No disponible" : ""
                                } ${
                                    producto?.stock! < 1 ? "Se acabó stock" : ""
                                }`
                            );
                        }
                    }

                    if (detail_order.coupon) {
                        const { discount } =
                            await this.productsApiService.coupon(
                                detail_order.coupon,
                                productId,
                                information
                            );
                        sub = subtotal(sub, discount);
                    }
                }

                return {
                    subtotal: sub * detail_order.quantity,
                };
            })
        );

        const total = detailsOrder.reduce((ins, prod) => {
            return ins + prod.subtotal;
        }, 0);
        let totalWithDistrict = total;

        if (ordersStoreDto.district_id) {
            const { data } = await this.ubigeoApiService.districtsShow(
                ordersStoreDto.district_id
            );
            const priceShip = information.igv
                ? subtotal(
                      ((data!.province as Provinces).department as Departments)
                          .priceShipping,
                      enviroments.VITE_IGV,
                      true
                  )
                : ((data!.province as Provinces).department as Departments)
                      .priceShipping;
            totalWithDistrict = totalWithDistrict + priceShip;
        }

        /* verificamos que el total del cliente y servidor sean iguales */
        if (ordersStoreDto.total !== totalWithDistrict)
            throw new BadRequestException(
                "Hubo un error al realizar est orden."
            );

        const order = new Orders({
            ...rest,
            igv: information!.igv,
            pasarela_comision,
            moneyChange: moneyConverter,
            is_pasarela_client: information!.enabledClientPayComision,
        });
        order.order_code = await generateCodeEntity(
            Orders,
            "order_code" as keyof Orders,
            "ORD"
        );
        await order.save();
        if (invoice) {
            const { correlativo } =
                await this.invoicesApiService.latestCorrelativo(
                    invoice.kind_invoice_code
                );
            const serie =
                invoice.kind_invoice_code === "00"
                    ? "TICKET"
                    : invoice.kind_invoice_code === "01"
                    ? "F001"
                    : "B001";

            await this.invoicesApiService.store({
                ...invoice!,
                serie,
                order_id: order.id,
                cdr_path: null,
                xml_path: null,
                correlativo,
                response_sunat: null,
            });
        }
        await Promise.all(
            details_orders.map(async (detail_order) => {
                const [newDetailOrder, { product }] = await Promise.all([
                    this.detailOrdersApiService.store({
                        ...detail_order,
                        order_id: order.id,
                    }),
                    this.productsApiService.show(
                        information,
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (detail_order as any)[
                            productEntityId(information.type_empresa)
                        ]
                    ),
                ]);
                if (information.type_empresa === "normal") {
                    // encontrar variant
                    const variant = (
                        product.dataValues.variants as Variants[]
                    ).find(
                        (variant) => variant.id === detail_order.variant_id
                    )!;
                    if (!variant?.ilimit) {
                        // reatamos la cantidad del stock de los productos
                        const quantity = variant.stock! - detail_order.quantity;
                        await product.update({ stock: quantity });
                    }
                    // si hay cupon descontar el cupon de uso
                    if (detail_order.coupon) {
                        const { coupon } = await this.productsApiService.coupon(
                            detail_order.coupon,
                            product.id,
                            information
                        );
                        if (coupon) {
                            if (coupon.max_use > 0) {
                                const decrease = coupon.max_use - 1;
                                await coupon.update({ max_use: decrease });
                            }
                        }
                    }
                } else {
                    const producto = product as
                        | ProductsRestaurant
                        | ProductsServicio;
                    if (producto instanceof ProductsRestaurant) {
                        if (!producto?.ilimit) {
                            // reatamos la cantidad del stock de los productos
                            const quantity =
                                producto.stock! - detail_order.quantity;
                            await producto.update({ stock: quantity });
                        }
                    }
                }

                // si hay cupon descontar el cupon de uso
                if (detail_order.coupon) {
                    const { coupon } = await this.productsApiService.coupon(
                        detail_order.coupon,
                        product.id,
                        information
                    );
                    if (coupon) {
                        if (coupon.max_use > 0) {
                            const decrease = coupon.max_use - 1;
                            await coupon.update({ max_use: decrease });
                        }
                    }
                }
                return newDetailOrder;
            })
        );
        try {
            if (information.enabledSendMessage && ordersStoreDto.telephone) {
                await clients[information.slug].sendMessage(
                    `51${ordersStoreDto.telephone}@c.us`,
                    `Hola 😊, Aquí está el código de su orden *${order.order_code}*.\nPara ver el estado de su orden revise en ${enviroments.VITE_URL}/pedidos`
                );
            }
        } catch (error) {}

        return {
            success: true,
            order,
            details_orders,
        };
    }
    // actualizar orden
    async update(props: {
        order_code: string;
        ordersUpdateDto: OrdersUpdateDto;
        req: Request;
    }) {
        const { invoice, note, ...rest } = props.ordersUpdateDto;
        const information = (props.req as RequestVigilio).information!;
        const user = props.req.user as Users;

        // const subFacturacion = (
        //     props.req as RequestVigilio
        // ).permissionWeb.subFacturacion();
        const subFacturacion = true; //!
        const { order } = await this.show(information, props.order_code);
        const vendedor = `${user?.name ?? ""} ${user?.lastname ?? ""}`;

        if (
            rest.status_order_id === STATUSORDER.pagado ||
            rest.status_order_id === STATUSORDER.entregado
        ) {
            await this.onInvoice({
                order,
                information,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }

        if (
            rest.status_order_id === STATUSORDER.enviando ||
            rest.status_order_id === STATUSORDER.pagado
        ) {
            await this.onGuides({
                order,
                information,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }
        // si no envio factura o boleta y tenga el sunat props
        if (rest.status_order_id === STATUSORDER.problema) {
            await this.onNote({
                order,
                information,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }
        if (
            rest.status_order_id === STATUSORDER.problema &&
            order.status_order_id !== STATUSORDER.problema
        ) {
            //  se resetea la cantidad y cupon
            await Promise.all(
                (order.dataValues.details_orders as DetailOrders[]).map(
                    async (detail_order) => {
                        const { product } = await this.productsApiService.show(
                            information,
                            String(detail_order.product_normal_id)
                        );
                        // encontrar variant
                        if (information.type_empresa === "normal") {
                            const variant = (
                                product.dataValues.variants as Variants[]
                            ).find(
                                (variant) =>
                                    variant.id === detail_order.variant_id
                            );
                            if (!variant?.ilimit) {
                                // reatamos la cantidad del stock de los productos
                                const quantity =
                                    variant!.stock! + detail_order.quantity;
                                await product.update({ stock: quantity });
                            }
                            // si hay cupon descontar el cupon de uso
                            if (detail_order.coupon) {
                                const { coupon } =
                                    await this.productsApiService.coupon(
                                        detail_order.coupon,
                                        product.id,
                                        information
                                    );
                                if (coupon) {
                                    if (coupon.max_use > 0) {
                                        const decrease = coupon.max_use + 1;
                                        await coupon.update({
                                            max_use: decrease,
                                        });
                                    }
                                }
                            }
                        } else {
                            const producto = product as
                                | ProductsRestaurant
                                | ProductsServicio;
                            if (producto instanceof ProductsRestaurant) {
                                if (!producto?.ilimit) {
                                    // reatamos la cantidad del stock de los productos
                                    const quantity =
                                        producto!.stock! +
                                        detail_order.quantity;
                                    await product.update({ stock: quantity });
                                }
                            }

                            // si hay cupon descontar el cupon de uso
                            if (detail_order.coupon) {
                                const { coupon } =
                                    await this.productsApiService.coupon(
                                        detail_order.coupon,
                                        product.id,
                                        information
                                    );
                                if (coupon) {
                                    if (coupon.max_use > 0) {
                                        const decrease = coupon.max_use + 1;
                                        await coupon.update({
                                            max_use: decrease,
                                        });
                                    }
                                }
                            }
                        }
                    }
                )
            );
        }
        await order.update({ ...rest, seller_id: user ? user.id : null });
        return {
            success: true,
            order,
        };
    }

    async onInvoice(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        information: InformationEntity;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const {
            information,
            order,
            ordersUpdateDto,
            subFacturacion,
            vendedor,
        } = props;
        const { invoice } = ordersUpdateDto;
        const detail_orders = order.dataValues.details_orders as DetailOrders[];
        const getInvoice = order.dataValues.invoice;

        if (invoice) {
            let files: {
                xml_path: string | null;
                cdr_path: string | null;
                response_sunat: InvoiceResponseSunat | null;
            } = {
                xml_path: getInvoice?.xml_path ?? null,
                cdr_path: getInvoice?.cdr_path ?? null,
                response_sunat: getInvoice?.response_sunat ?? null,
            };
            if (!getInvoice) {
                const { correlativo } =
                    await this.invoicesApiService.latestCorrelativo(
                        invoice.kind_invoice_code
                    );
                const serie =
                    invoice?.kind_invoice_code === "00"
                        ? "TICKET"
                        : invoice?.kind_invoice_code === "01"
                        ? "F001"
                        : "B001";
                invoice.correlativo = correlativo;
                invoice.serie = serie;
            }

            const sunat = await onInvoiceSunat({
                detail_orders,
                information,
                invoice,
                order,
                vendedor,
            });

            // si no existe pdf path que cree y guarda y si tiene subfacturacion
            if (
                !files.xml_path &&
                (invoice.kind_invoice_code === "01" ||
                    invoice.kind_invoice_code === "03")
            ) {
                const xml = await xmlGenerate({
                    information,
                    sunat,
                    order,
                    type: "invoice",
                });
                files = { ...files, xml_path: xml };
            }

            // le dio enviar sunat y no habia enviado a sunat antes y que no pase de 2 dias
            const limitInvoice =
                restarDays(
                    NOW().toDate(),
                    TimePeru(order.createdAt!)
                        .add(enviroments.VITE_DIASFACTURASBOLETA, "day")
                        .diff(NOW())
                ) < 0;
            if (
                invoice.send_sunat &&
                !getInvoice?.send_sunat &&
                subFacturacion &&
                limitInvoice &&
                (invoice.kind_invoice_code === "01" ||
                    invoice.kind_invoice_code === "03")
            ) {
                const { sunatResponse } = await invoiceSendSunatApi(sunat);
                // crdGenerate
                if (!sunatResponse.success) {
                    invoice.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                    throw new BadRequestException(
                        JSON.stringify(sunatResponse.error)
                    );
                }
                const cdr = await crdGenerate({
                    cdrzip: sunatResponse.cdrZip,
                    information,
                    orderCode: props.order.order_code,
                });
                files = {
                    ...files,
                    cdr_path: cdr,
                    response_sunat: {
                        cdrResponse: sunatResponse.cdrResponse,
                        error: sunatResponse.error,
                    },
                };
            }

            if (
                ordersUpdateDto.telephone &&
                ordersUpdateDto.send_message &&
                information.enabledSendMessage
            ) {
                const type =
                    invoice?.kind_invoice_code === "01"
                        ? "FACTURA"
                        : invoice?.kind_invoice_code === "03"
                        ? "BOLETA"
                        : "";
                try {
                    await clients[information.slug].sendMessage(
                        `51${ordersUpdateDto.telephone}@c.us`,
                        information.whatsappconfig.thank.replace(
                            "{COMPROBANTE}",
                            type
                        )
                    );
                    await delay(2);
                    const { pdfBuffer, file } = await pdfGenerate({
                        information,
                        sunat,
                        order,
                        type:
                            invoice?.kind_invoice_code === "01" ||
                            invoice?.kind_invoice_code === "03"
                                ? "invoice"
                                : "ticket",
                    });
                    const media = await new MessageMedia(
                        "application/pdf",
                        pdfBuffer.toString("base64"),
                        file
                    );

                    await clients[information.slug].sendMessage(
                        `51${ordersUpdateDto.telephone}@c.us`,
                        media,
                        { sendMediaAsDocument: true }
                    );
                    await delay(2);
                    await clients[information.slug].sendMessage(
                        `51${ordersUpdateDto.telephone}@c.us`,
                        information.whatsappconfig.thank2.replace(
                            "{URL}",
                            enviroments.VITE_URL
                        )
                    );
                } catch (error) {}
            }
            if (getInvoice) {
                if (!getInvoice.send_sunat) {
                    await this.invoicesApiService.update(
                        String(getInvoice.id),
                        {
                            ...invoice!,
                            ...files,
                            order_id: order.id,
                        }
                    );
                }
            } else {
                await this.invoicesApiService.store({
                    ...invoice!,
                    ...files,
                    order_id: order.id,
                });
            }
        }
    }
    async onNote(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        information: InformationEntity;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const detail_orders = props.order.dataValues.details_orders;
        const getInvoice = props.order.dataValues.invoice;
        if (getInvoice) {
            const {
                information,
                order,
                ordersUpdateDto,
                subFacturacion,
                vendedor,
            } = props;
            const { note } = ordersUpdateDto;
            if (note) {
                const getNote = (await getInvoice.$get("note")) as Notes;
                // si no existe nota
                let files: {
                    xml_path: string | null;
                    cdr_path: string | null;
                    response_sunat: NoteResponseSunat | null;
                } = {
                    xml_path: getNote?.xml_path ?? null,
                    cdr_path: getNote?.cdr_path ?? null,
                    response_sunat: getNote?.response_sunat ?? null,
                };
                if (!getNote) {
                    const { correlativo } =
                        await this.notesApiService.latestCorrelativo(
                            note.kind_invoice_code
                        );

                    const type =
                        getInvoice.kind_invoice_code === "01" ? "F" : "B";
                    const serie =
                        note.kind_invoice_code === "07"
                            ? `${type}C01`
                            : `${type}D01`;
                    note.correlativo = correlativo;
                    note.serie = serie;
                }
                const sunat = await onNoteSunat({
                    detail_orders,
                    information,
                    note,
                    order,
                    invoice: getInvoice,
                    vendedor,
                });
                if (
                    props.ordersUpdateDto.status_order_id ===
                        STATUSORDER.problema &&
                    (note.kind_invoice_code === "07" || // solo nota de creditos y notas de debito
                        note.kind_invoice_code === "08")
                ) {
                    // si no existe pdf path ni xml_path que cree y guarda
                    if (!files.xml_path) {
                        const xml = await xmlGenerate({
                            information,
                            sunat,
                            order,
                            type: "note",
                        });
                        files = { ...files, xml_path: xml };
                    }

                    // le dio enviar sunat y no habia enviado a sunat antes
                    if (
                        note.send_sunat &&
                        !getNote?.send_sunat &&
                        subFacturacion
                    ) {
                        const { sunatResponse } = await noteSendSunatApi(sunat);
                        // crdGenerate
                        if (!sunatResponse.success) {
                            note.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                            throw new BadRequestException(
                                JSON.stringify(sunatResponse.error)
                            );
                        }
                        const cdr = await crdGenerate({
                            cdrzip: sunatResponse.cdrZip,
                            information,
                            orderCode: props.order.order_code,
                        });
                        files = {
                            ...files,
                            cdr_path: cdr,
                            response_sunat: {
                                cdrResponse: sunatResponse.cdrResponse,
                                error: sunatResponse.error,
                            },
                        };
                    }
                }
                const type =
                    note?.kind_invoice_code === "01"
                        ? "FACTURA"
                        : note?.kind_invoice_code === "08"
                        ? "BOLETA"
                        : "TICKET";
                if (
                    ordersUpdateDto.telephone &&
                    ordersUpdateDto.send_message &&
                    information.enabledSendMessage
                ) {
                    try {
                        await clients[information.slug].sendMessage(
                            `51${ordersUpdateDto.telephone}@c.us`,
                            information.whatsappconfig.sendpdf.replace(
                                "{COMPROBANTE}",
                                type
                            )
                        );
                        await delay(2);
                        const { pdfBuffer, file } = await pdfGenerate({
                            information,
                            sunat,
                            order,
                            type: "note",
                        });
                        const media = new MessageMedia(
                            "application/pdf",
                            pdfBuffer.toString(),
                            file
                        );
                        await clients[information.slug].sendMessage(
                            `51${ordersUpdateDto.telephone}@c.us`,
                            media,
                            { sendMediaAsDocument: true }
                        );
                        await delay(2);
                        await clients[information.slug].sendMessage(
                            `51${ordersUpdateDto.telephone}@c.us`,
                            information.whatsappconfig.thank2.replace(
                                "{URL}",
                                enviroments.VITE_URL
                            )
                        );
                    } catch (error) {}
                }
                if (getNote) {
                    if (!getNote.send_sunat) {
                        await this.notesApiService.update(String(getNote.id), {
                            ...note!,
                            ...files,
                            invoice_id: getInvoice.id,
                            order_id: order.id,
                        });
                    }
                } else {
                    await this.notesApiService.store({
                        ...note!,
                        ...files,
                        invoice_id: getInvoice.id,
                        order_id: order.id,
                    });
                }
            }
        }
    }
    async onGuides(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        information: InformationEntity;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const detail_orders = props.order.dataValues
            .details_orders as DetailOrders[];
        const getGuide = props.order.dataValues.guide;
        const {
            information,
            order,
            ordersUpdateDto,
            subFacturacion,
            vendedor,
        } = props;
        const { guide } = ordersUpdateDto;
        if (guide) {
            // si no existe nota
            let files: {
                xml_path: string | null;
                cdr_path: string | null;
                response_sunat: NoteResponseSunat | null;
            } = {
                xml_path: getGuide?.xml_path ?? null,
                cdr_path: getGuide?.cdr_path ?? null,
                response_sunat: getGuide?.response_sunat ?? null,
            };
            if (!getGuide) {
                const { correlativo } =
                    await this.guidesApiService.latestCorrelativo(
                        guide.kind_guide_code
                    );

                guide.correlativo = correlativo;
                guide.serie = "T001";
            }
            const sunat = await onGuideSunat({
                detail_orders,
                information,
                guide,
                order,
                vendedor,
            });
            if (
                props.ordersUpdateDto.status_order_id ===
                    STATUSORDER.enviando &&
                guide.kind_guide_code === "09"
            ) {
                // si no existe pdf path ni xml_path que cree y guarda
                if (!files.xml_path) {
                    const xml = await xmlGenerate({
                        information,
                        sunat,
                        order,
                        type: "guide",
                    });

                    files = { ...files, xml_path: xml };
                }

                // le dio enviar sunat y no habia enviado a sunat antes
                if (
                    guide.send_sunat &&
                    !getGuide?.send_sunat &&
                    subFacturacion
                ) {
                    const { sunatResponse } = await guideSendSunatApi(sunat);
                    // crdGenerate
                    if (!sunatResponse.success) {
                        guide.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                        throw new BadRequestException(
                            JSON.stringify(sunatResponse.error)
                        );
                    }
                    const cdr = await crdGenerate({
                        cdrzip: sunatResponse.cdrZip,
                        information,
                        orderCode: props.order.order_code,
                    });
                    files = {
                        ...files,
                        cdr_path: cdr,
                        response_sunat: {
                            cdrResponse: sunatResponse.cdrResponse,
                            error: sunatResponse.error,
                        },
                    };
                }
            }

            if (getGuide) {
                await this.guidesApiService.update(String(getGuide.id), {
                    ...guide!,
                    ...files,
                    order_id: order.id,
                });
            } else {
                await this.guidesApiService.store({
                    ...guide!,
                    ...files,
                    order_id: order.id,
                });
            }
        }
        if (
            ordersUpdateDto.status_order_id === STATUSORDER.enviando &&
            information.enabledSendMessage
        ) {
            try {
                const products = await Promise.all(
                    detail_orders.map(async (prod, i) => {
                        const Product = productEntity(information.type_empresa);
                        const product = await Product.findOne({
                            where: {
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                id: (prod as any)[
                                    productEntityId(information.type_empresa)
                                ],
                                information_id: information.id,
                            },
                            attributes: ["id", "name"],
                        });
                        if (!product)
                            throw new BadRequestException(
                                "No se encontró ese producto"
                            );
                        return `${i + 1} - *Producto*: ${
                            product.name
                        }, *Precio Total*: ${formatMoney(
                            prod.price,
                            props.order.moneyChange === 1 ? "SOLES" : "DOLARES"
                        )}, *Cantidad*: ${prod.quantity} UND.\n`;
                    })
                );
                await clients[information.slug].sendMessage(
                    `51${ordersUpdateDto.telephone}@c.us`,
                    `Hola 😊, Somos ${information.name_empresa}. \n Su orden *${order.order_code}*:\n Se está enviando su pedido a su domicilio ${order.address}.\n${products}`
                );
            } catch (error) {}
        }
    }
}
