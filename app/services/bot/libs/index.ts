import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import enviroments from "~/config/enviroments.config";
import { InformationEntity } from "@/information/entities/information.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { subtotalIgv } from "@/cart/libs/helpers";
import { NOW } from "~/libs/dayjs";
import { distanciaDeLevenshtein } from "~/libs/helpers";
import cache from "@vigilio/express-core/cache";
import { Orders } from "@/orders/entities/orders.entity";
import type { PayMethods } from "@/orders/entities/pay_methods.entity";
import type { StatusOrders } from "@/orders/entities/status_orders.entity";
import { Categories } from "@/products/entities/categories.entity";
import { openAis } from "./ai";
import { productEntity } from "@/products/libs";
import type { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { Users } from "@/users/entities/users.entity";

export async function transcribeAudio(empresa: string, fileBuffer: Buffer) {
    const dirTemp = path.resolve(__dirname, "tmp");
    if (!fs.existsSync(dirTemp)) {
        fs.mkdirSync(dirTemp);
    }
    const filePath = `${dirTemp}/${crypto.randomUUID()}.wav`;
    fs.writeFileSync(filePath, fileBuffer);
    const file = fs.createReadStream(filePath);
    // Send the audio file for transcription using the specified model.
    const transcription = await openAis[empresa].audio.transcriptions.create({
        file,
        model: "whisper-1",
    });
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    // Return the transcription result.
    return transcription;
}

export async function onDb(information: InformationEntity) {
    const Products = productEntity(information.type_empresa);
    const [categorias, products] = await Promise.all([
        Categories.unscoped().findAll({
            attributes: ["id", "name"],
            raw: true,
        }),
        Products.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        }),
    ]);
    const cleanData = await Promise.all(
        (products as ProductsNormal[]).map(async (product) => {
            return {
                id: product.id,
                name: product.name.toLowerCase(),
                imagen: product.images
                    ? printFileWithDimension(product.images, 100)[0]
                    : "",
                price: subtotalIgv(information!, product),
                disponible: product.enabled,
            };
        })
    );
    return { categorias, products: cleanData };
}

function encontrarPalabrasSimilares(texto: string, array: string[]) {
    const palabrasEncontradas = [];
    const palabrasTexto = texto.toLowerCase().trim().split(/\s+/);

    for (const palabra of array) {
        const palabraMin = palabra.toLowerCase().trim();
        for (const palabraTexto of palabrasTexto) {
            const umbral = Math.floor(palabraTexto.length * 0.2);
            if (
                palabraMin.includes(palabraTexto) ||
                distanciaDeLevenshtein(palabraMin, palabraTexto) <= umbral
            ) {
                // Agregamos solo si hay una coincidencia exacta o muy cercana con alguna palabra en el texto
                if (palabraMin.includes(palabraTexto)) {
                    palabrasEncontradas.push(palabra);
                    break; // Rompemos el bucle interno si encontramos una coincidencia para evitar duplicados
                }
            }
        }
    }

    return palabrasEncontradas;
}

export async function promptReplace(
    message: string,
    information: InformationEntity
) {
    let data: { products: { name: string }[] } = JSON.parse(
        cache.get("db-data") ?? "null"
    );

    if (!data) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        data = (await onDb(information)) as any;
        cache.set(
            "db-data",
            JSON.stringify(data),
            information.inteligenceArtificial.hour_update * 3600
        );
    }
    let productsData = data.products;
    // si no es inteligente que busque
    if (!information.inteligenceArtificial.enabledBotInteligence) {
        const palabrasEncontradas2 = encontrarPalabrasSimilares(
            message,
            data.products.map((prod) => prod.name)
        );
        productsData = await data.products.filter((prod) =>
            palabrasEncontradas2.includes(prod.name)
        );
    }
    const regex = /ord-[A-Za-z0-9]+/g;
    const coincidencias = message.toLowerCase().match(regex);
    let ordenes =
        "ó Si te pido informacion de pedido: decime que los codigo empiezan en ORD- \n Ordenes:\n";
    if (coincidencias?.length) {
        const orden = await Promise.all(
            coincidencias?.map(async (code) => {
                const order = await Orders.findOne({
                    where: { order_code: code.toUpperCase() },
                    attributes: [
                        "order_code",
                        "address",
                        "telephone",
                        "total",
                        "pay_method_id",
                        "status_order_id",
                    ],
                });
                if (!order) return `${code.toUpperCase()} - no se encontró.\n`;

                return `Codigo: ${code.toUpperCase()}, Total: S/. ${
                    order.total
                }, vendedor:${
                    order.user ? (order.user as Users)?.username : null
                },Metododepago:${
                    order.pay_method_id
                        ? (order.pay_method as PayMethods).name
                        : null
                }, direccion:${order.address}, estado: *${
                    (order.status_order as StatusOrders).name
                }* \n`;
            })
        );
        ordenes += `${orden.join(".")}\n`;
        productsData = [];
    } else {
        ordenes += "no hay pedidos aun";
    }

    const prompt = information.inteligenceArtificial.prompt
        .replaceAll("{NAME_IA}", information.inteligenceArtificial.nameIa)
        .replaceAll("{WEB}", enviroments.VITE_URL)
        .replaceAll("{EMPRESA}", information.name_empresa)
        .replaceAll("{TIPO_EMPRESA}", enviroments.TIPO_EMPRESA)
        .replaceAll(
            "{DB}",
            `(${JSON.stringify({ ...data, products: productsData })}).`
        )
        .replaceAll("{IGV}", JSON.stringify(information.igv))
        .replaceAll("{DATE}", NOW().format("YYYY-MM-DD"))
        .replaceAll(
            "{DATOS}",
            JSON.stringify(
                information.inteligenceArtificial.datos.map(
                    (dato) => `- ${dato}.`
                )
            )
        )
        .replace(
            "{NUMERO_RECLAMO}",
            information.telephoneReclamos ?? "no disponible"
        )
        .replace("{DIRECCION}", JSON.stringify(information.address))
        .replace("{EMAIL}", information.email);

    return `${prompt}. ${ordenes}. ERES UNA IA POR OPEN AI, pero fuiste entrenado por https://vigilio-services.com`;
}
