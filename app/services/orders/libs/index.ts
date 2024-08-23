import type { SunatInvoiceDto } from "../sunat/dtos/sunat.invoice.dto";
import type { InvoicesSchema } from "../schemas/invoices.schema";
import type { DetailOrdersStoreDto } from "../dtos/detail_orders.store.dto";
import type { NotesSchema } from "../schemas/notes.schema";
import type { SunatNoteDto } from "../sunat/dtos/sunat.note.dto";
import type { Invoices } from "../entities/invoices.entity";
import type { InformationEntitySchema } from "@/information/schemas/information.schema";
import { InformationEntity } from "@/information/entities/information.entity";
import { pathUploads } from "@/uploads/libs/helpers";
import { invoicePDFSunatApi } from "../sunat/invoice.pdf.api";
import {
    InternalServerErrorException,
    NotFoundException,
} from "@vigilio/express-core";
import { invoiceXMLSunatApi } from "../sunat/invoice.xml.api";
import { notePDFSunatApi } from "../sunat/note.pdf.api";
import { noteXMLSunatApi } from "../sunat/note.xml.api";
import { subtotal } from "@/cart/libs/helpers";
import { KindCreditNotes } from "../entities/kind_credit_notes.entity";
import { KindDebitNotes } from "../entities/kind_debit_notes.entity";
import { ticketHTML } from "./ticket";
import { Orders } from "../entities/orders.entity";
import puppeteer from "puppeteer";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import { slug } from "@vigilio/express-core/helpers";
import type { Guides } from "../entities/guides.entity";
import type { GuidesSchema } from "../schemas/guides.schema";
import type { SunatGuideDto } from "../sunat/dtos/sunat.guide.dto";
import { pasarelaComision, paypalComision } from "@/payments/libs";
import type { DetailOrders } from "../entities/detail_orders.entity";
import type { Districts } from "@/ubigeo/entities/districts.entity";
import type { Provinces } from "@/ubigeo/entities/provinces.entity";
import type { Departments } from "@/ubigeo/entities/departments.entity";
import { guidePDFSunatApi } from "../sunat/guide.pdf.api";
import { productEntity, productEntityId } from "@/products/libs";
export const ordersTransferenciaImage = [800];

export const isValidDni = new RegExp(/^\d{8}$/);
export const isValiRUC = new RegExp(/^(10|20)\d{9}$/);

export type StatusOrdersType =
    | "pendiente"
    | "confirmado"
    | "preparado"
    | "enviando"
    | "pagado"
    | "entregado"
    | "problema";
export const STATUSORDER: Record<StatusOrdersType, number> = {
    pendiente: 1,
    confirmado: 2,
    preparado: 3,
    enviando: 4,
    pagado: 5,
    entregado: 6,
    problema: 7,
};
export type PayMethodType =
    | "efectivo"
    | "tarjeta"
    | "yape"
    | "paypal"
    | "transferencia"
    | "otro";
export const PAYMETHOD: Record<PayMethodType, number> = {
    efectivo: 1,
    tarjeta: 2,
    yape: 3,
    paypal: 4,
    transferencia: 5,
    otro: 6,
};

interface PdfGenerateProps {
    information: InformationEntity;
    type: "invoice" | "note" | "ticket" | "guide";
    sunat: SunatInvoiceDto | SunatNoteDto | SunatGuideDto | null;
    order: Orders;
}
// save: boolean save in filessystem
export async function pdfGenerate(props: PdfGenerateProps, save = false) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
    });
    try {
        let pdf: string | null = null;
        if (props.type === "invoice") {
            pdf = await invoicePDFSunatApi(props.sunat as SunatInvoiceDto);
        }
        if (props.type === "note") {
            pdf = await notePDFSunatApi(props.sunat as SunatNoteDto);
        }
        if (props.type === "guide") {
            pdf = await guidePDFSunatApi(props.sunat as SunatGuideDto);
        }
        if (props.type === "ticket") {
            pdf = await ticketHTML(props.order, props.information);
        }

        const page = await browser.newPage();
        await page.setContent(pdf!);
        const pdfBuffer = await page.pdf({
            width: "95mm",
            height: "385mm",
        });
        const file = `${props.information.slug}/sunat/${slug(
            props.information.slug
        )}-${props.order.order_code}-${props.type}.pdf`;
        if (save) {
            if (fs.existsSync(`${pathUploads()}/${file}`)) {
                fs.unlinkSync(`${pathUploads()}/${file}`);
            }
            fs.writeFileSync(`${pathUploads()}/${file}`, pdfBuffer);
        }
        await browser.close();
        return { file, pdfBuffer };
    } catch (error) {
        throw new InternalServerErrorException(
            "PDF no se subio correctamente, comunicarte con desarrollador, Posible error: no está disponible web de factura"
        );
    }
}
export async function xmlGenerate(props: PdfGenerateProps) {
    let xml: string | null = null;
    if (props.type === "invoice") {
        xml = await invoiceXMLSunatApi(props.sunat as SunatInvoiceDto);
    }
    if (props.type === "note") {
        xml = await noteXMLSunatApi(props.sunat as SunatNoteDto);
    }
    const file = `sunat/${slug(props.information.slug)}-${
        props.order.order_code
    }-${props.type}.xml`;
    if (fs.existsSync(`${pathUploads()}/${file}`)) {
        fs.unlinkSync(`${pathUploads()}/${file}`);
    }
    fs.writeFileSync(`${pathUploads()}/${file}`, xml!);
    return file;
}
export async function crdGenerate(props: {
    information: InformationEntity;
    orderCode: string;
    cdrzip: string;
}) {
    const file = `sunat/${slug(props.information.slug)}-${
        props.orderCode
    }-${Date.now().toString(32).slice(3)}.cdr`;
    if (fs.existsSync(`${pathUploads()}/${file}`)) {
        fs.unlinkSync(`${pathUploads()}/${file}`);
    }
    fs.writeFileSync(`${pathUploads()}/${file}`, props.cdrzip);
    return file;
}

interface OnInvoiceSunatProps {
    invoice: Pick<
        InvoicesSchema,
        | "document_code"
        | "razon_social"
        | "identification_number"
        | "kind_invoice_code"
        | "correlativo"
        | "serie"
        | "createdAt"
    >;
    detail_orders: DetailOrdersStoreDto[];
    information: InformationEntity;
    order: Orders;
    vendedor: string;
}

// https://www.sunat.gob.pe/legislacion/superin/2015/anexoI-274-2015.pdf
export async function onInvoiceSunat({
    invoice,
    detail_orders,
    information,
    order,
    vendedor,
}: OnInvoiceSunatProps): Promise<SunatInvoiceDto> {
    const client: SunatInvoiceDto["client"] = {
        tipoDoc: invoice.identification_number ? invoice.document_code : "0",
        rznSocial: invoice.razon_social ?? "Cliente General",
        numDoc: invoice.identification_number ?? "00000000",
    } as SunatInvoiceDto["client"];
    const addressInformation = (information as InformationEntitySchema).address;
    const address = {
        ubigeo: addressInformation.district_id,
        departamento: addressInformation.district.department.name,
        provincia: addressInformation.district.province.name,
        distrito: addressInformation.district.name,
        urbanizacion: addressInformation.urbanizacion,
        direccion: addressInformation.direccion,
        codLocal: addressInformation.codLocal,
    };
    const details = await detailInvoice(information, detail_orders, order);
    return {
        ublVersion: "2.1",
        tipoOperacion: "0101",
        tipoDoc: invoice.kind_invoice_code, //boleta o factura
        serie: invoice.serie,
        correlativo: String(invoice.correlativo),
        // paypal solo permite dolares
        tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
        fechaEmision: invoice.createdAt
            ? new Date(invoice.createdAt!)
            : new Date(),
        formaPago: {
            moneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
            tipo: "Contado",
        },
        client,
        details,
        company: {
            logo: information.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.logo[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: information.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.certificado[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: information.telephoneFirst,
            vendedor,
            address,
            ...information.company,
        },
    };
}

interface OnNoteSunatProps {
    note: Pick<
        NotesSchema,
        | "kind_invoice_code"
        | "document_code"
        | "razon_social"
        | "identification_number"
        | "correlativo"
        | "kind_credit_notes_code"
        | "kind_debit_notes_code"
        | "serie"
        | "createdAt"
    >;
    invoice: Pick<
        InvoicesSchema,
        "serie" | "correlativo" | "kind_invoice_code" | "createdAt"
    >;
    detail_orders: DetailOrdersStoreDto[];
    information: InformationEntity;
    order: Orders;
    vendedor: string;
}

export async function onNoteSunat({
    note,
    detail_orders,
    information,
    invoice,
    order,
    vendedor,
}: OnNoteSunatProps): Promise<SunatNoteDto> {
    //  si existe kind_credit_notes_code entonces mostrarme name de kind_credit_notes_code sino de  kind_debit_notes_code
    const notekind =
        note.kind_invoice_code === "07"
            ? await KindCreditNotes.findByPk(note.kind_credit_notes_code!)
            : await KindDebitNotes.findByPk(note.kind_debit_notes_code!);

    const client: SunatInvoiceDto["client"] = {
        tipoDoc: note.identification_number ? note.document_code : "0",
        rznSocial: note.razon_social ?? "Cliente General",
        numDoc: note.identification_number ?? "00000000",
    } as SunatInvoiceDto["client"];
    const addressInformation = (information as InformationEntitySchema).address;
    const address = {
        ubigeo: addressInformation.district_id,
        departamento: addressInformation.district.department.name,
        provincia: addressInformation.district.province.name,
        distrito: addressInformation.district.name,
        urbanizacion: addressInformation.urbanizacion,
        direccion: addressInformation.direccion,
        codLocal: addressInformation.codLocal,
    };
    const details = await detailInvoice(information, detail_orders, order);
    return {
        ublVersion: "2.1",
        tipoOperacion: "0101",
        correlativo: String(note.correlativo),
        tipoDoc: note.kind_invoice_code, // nota de credito o debito
        serie: note.serie,
        codMotivo:
            note.kind_invoice_code === "07"
                ? note.kind_credit_notes_code!
                : note.kind_debit_notes_code!,
        desMotivo: notekind!.name,
        numDocfectado: `${invoice.serie}-${invoice.correlativo}`,
        tipDocAfectado: invoice.kind_invoice_code,
        tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
        fechaEmision: note.createdAt ? new Date(note.createdAt!) : new Date(),
        formaPago: {
            moneda: order.moneyChange === 1 ? "PEN" : "USD", // aca si deseas cambiar a dolar
            tipo: "Contado",
        },
        client,
        details,
        company: {
            logo: information.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.logo[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: information.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.certificado[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: information.telephoneFirst,
            vendedor,
            address,
            ...information.company,
        },
    };
}
interface OnGuideSunatProps {
    guide: Omit<
        GuidesSchema,
        "cdr_path" | "xml_path" | "order_id" | "response_sunat" | "id"
    >;
    detail_orders: DetailOrdersStoreDto[];
    information: InformationEntity;
    order: Orders;
    vendedor: string;
}

export async function onGuideSunat({
    guide,
    detail_orders,
    information,
    order,
    vendedor,
}: OnGuideSunatProps): Promise<SunatGuideDto> {
    const addressInformation = (information as InformationEntitySchema).address;
    const address = {
        ubigeo: addressInformation.district_id,
        departamento: addressInformation.district.department.name,
        provincia: addressInformation.district.province.name,
        distrito: addressInformation.district.name,
        urbanizacion: addressInformation.urbanizacion,
        direccion: addressInformation.direccion,
        codLocal: addressInformation.codLocal,
    };

    const items = await detailInvoice(information, detail_orders, order);
    return {
        version: "2022",
        correlativo: String(guide.correlativo),
        tipoDoc: guide.kind_guide_code, // guia
        serie: guide.serie,
        fechaEmision: guide.createdAt ? new Date(guide.createdAt!) : new Date(),
        destinatario: {
            numDoc: guide.destinatario.identification_number,
            rznSocial: guide.destinatario.razon_social,
            tipoDoc: guide.destinatario.document_code,
        },
        envio: {
            codTraslado: guide.datos_envio.motivo_traslado,
            modTraslado: guide.datos_envio.modalidad_traslado,
            fecTraslado: guide.datos_envio.fecha_initial_traslado,
            llegada: {
                direccion: guide.datos_envio.punta_llegada.address,
                ubigeo: guide.datos_envio.punta_llegada.ubigeo,
            },
            partida: {
                direccion: guide.datos_envio.punta_partida.address,
                ubigeo: guide.datos_envio.punta_partida.ubigeo,
            },
            transportista: {
                numDoc: guide.datos_envio.dato_transportista
                    .identification_number,
                rznSocial: guide.datos_envio.dato_transportista.razon_social,
                tipoDoc: guide.datos_envio.dato_transportista.document_code,
            },
            pesoTotal: guide.datos_envio.peso_total,
            undPesoTotal: guide.datos_envio.unidad,
        },
        details: items.map((prod) => ({
            codigo: prod.codProducto,
            descripcion: prod.descripcion,
            unidad: prod.unidad,
            cantidad: prod.cantidad,
        })),
        company: {
            logo: information.logo
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.logo[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : "", //si no existe logo que envie un string vacio
            certificado: information.certificado
                ? fs
                      .readFileSync(
                          `${pathUploads()}/${information.certificado[0].file}` // trae a la imagen 100px
                      )
                      .toString("base64")
                : null,
            condicion_pago: "Efectivo",
            telephone: information.telephoneFirst,
            vendedor,
            address,
            ...information.company,
        },
    };
}

export async function getOrder(
    information: InformationEntity,
    order: Orders,
    showDetailsOrder = true
) {
    const Product = productEntity(information.type_empresa);
    const [details_orders, invoice, guide] = await Promise.all([
        showDetailsOrder
            ? order.$get("details_orders", {
                  include: [
                      {
                          model: Product,
                          attributes: [
                              "id",
                              "product_code",
                              "name",
                              "images",
                              "slug",
                          ],
                      },
                  ],
              })
            : [],
        order.$get("invoice") as Promise<Invoices>,
        order.$get("guide") as Promise<Guides>,
    ]);
    let note = null;
    if (invoice) {
        note = await invoice.$get("note");
    }

    order.dataValues.guide = guide;
    order.dataValues.invoice = invoice;
    if (showDetailsOrder) {
        order.dataValues.details_orders = details_orders;
    }
    order.dataValues.note = note;
    return order;
}
export async function detailInvoice(
    information: InformationEntity,
    detail_orders: DetailOrdersStoreDto[],
    order: Orders
) {
    const IGV = order.igv ? information.igv : 0;
    const lengthDetails = (
        order.dataValues.details_orders as DetailOrders[]
    ).reduce((total, obj) => total + obj.quantity, 0);
    const departamento = order.district_id
        ? (((order.district as Districts).province as Provinces)
              .department as Departments)
        : null;
    const ig = departamento
        ? order.igv
            ? subtotal(departamento.priceShipping, enviroments.VITE_IGV, true)
            : departamento.priceShipping
        : 0;

    const details: SunatInvoiceDto["details"] = await Promise.all(
        detail_orders.map(async (prod) => {
            const Product = productEntity(information.type_empresa);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            const product_id = (prod as any)[
                productEntityId(information.type_empresa)
            ];
            const product = await Product.findByPk();
            if (!product)
                throw new NotFoundException(
                    `Hubo un error al encontrar este producto ${product_id}`
                );
            const priceWithoutIGV: number = order!.igv // dividir  con la cantida para obtener el precio original del producto
                ? prod.price / ((100 + IGV) / 100) / prod.quantity
                : prod.price / prod.quantity;

            let priceWithPasarelaCommission: number = priceWithoutIGV;
            const total = order.total - ig;
            if (order.is_pasarela_client) {
                if (order.pasarela_comision) {
                    const totalw = total / ((100 + IGV) / 100);
                    priceWithPasarelaCommission =
                        (totalw + pasarelaComision(totalw)) / lengthDetails;
                }

                if (order.paypal_token) {
                    priceWithPasarelaCommission =
                        (paypalComision(
                            total / ((100 + IGV) / 100),
                            order.moneyChange
                        ) *
                            order.moneyChange) /
                        lengthDetails;
                }
            }

            return {
                tipAfeIgv: 10, // catalogo 7
                codProducto: product.product_code,
                descripcion: product.name,
                unidad: "NIU",
                cantidad: prod.quantity, // cantidad de producto
                mtoValorUnitario:
                    priceWithPasarelaCommission / order.moneyChange, //precio sin igv
                mtoValorVenta:
                    (priceWithPasarelaCommission * prod.quantity) /
                    order.moneyChange, // precio sin igv * cantidad
                mtoBaseIgv:
                    (priceWithPasarelaCommission * prod.quantity) /
                    order.moneyChange, // mismo mtoValorVenta
                mtoPrecioUnitario:
                    subtotal(priceWithPasarelaCommission, IGV, true) /
                    order.moneyChange, // MONTO INCLUYENDO IGV
                igv:
                    (priceWithPasarelaCommission *
                        prod.quantity *
                        (IGV / 100)) /
                    order.moneyChange,
                totalImpuestos:
                    (priceWithPasarelaCommission *
                        prod.quantity *
                        (IGV / 100)) /
                    order.moneyChange,
                porcentajeIgv: IGV,
                factorIcbper: null,
                icbper: null,
            };
        })
    );
    if (departamento && departamento.priceShipping > 0) {
        details.push({
            tipAfeIgv: 10, // catalogo 7
            codProducto: "0",
            descripcion: `Precio de Envio - ${departamento.name}`,
            unidad: "NIU",
            cantidad: 1, // cantidad de producto
            mtoValorUnitario: departamento.priceShipping / order.moneyChange, //precio sin igv
            mtoValorVenta: departamento.priceShipping / order.moneyChange, // precio sin igv * cantidad
            mtoBaseIgv: departamento.priceShipping / order.moneyChange, // mismo mtoValorVenta
            mtoPrecioUnitario:
                subtotal(departamento.priceShipping, IGV, true) /
                order.moneyChange, // MONTO INCLUYENDO IGV
            igv: (departamento.priceShipping * (IGV / 100)) / order.moneyChange,
            totalImpuestos:
                (departamento.priceShipping * (IGV / 100)) / order.moneyChange,
            porcentajeIgv: IGV,
            factorIcbper: null,
            icbper: null,
        });
    }

    return details;
}
