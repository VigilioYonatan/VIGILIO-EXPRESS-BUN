import enviroments from "~/config/enviroments.config";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import type { FilesSchema } from "@/uploads/schemas/uploads.schema";
import { DetailOrders } from "@/orders/entities/detail_orders.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { STATUSORDER } from "@/orders/libs";
import type { InformationEntity } from "@/information/entities/information.entity";
import { ProductsNormal } from "../entities/products_normal.entity";
import { ProductsRestaurant } from "../entities/products_restaurant.entity";
import { ProductsServicio } from "../entities/products_servicio.entity";
import type { Empresa } from "@/information/schemas/information.schema";
import type { ProductsNormalSchema } from "../schemas/products_normal.schema";
import type { ProductsRestaurantSchema } from "../schemas/products_restaurant.entity";
import type { ProductsServicioSchema } from "../schemas/products_servicios.entity";
// products
export const productsImagesQualities = [100, 500];

//  categories
export const categoriesImageQualities = [100, 500, 800];

// export baseurl product /slug
export const baseUrlProduct = "/";

export function productEntity(empresa: Empresa) {
    const empresaProduct = {
        normal: ProductsNormal,
        restaurant: ProductsRestaurant,
        servicio: ProductsServicio,
    };
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return empresaProduct[empresa] as any;
}
export function productEntityId(empresa: Empresa) {
    const empresaProduct = {
        normal: "product_normal_id",
        restaurant: "product_restaurant_id",
        servicio: "product_servicio_id",
    };
    return empresaProduct[empresa];
}
/** combinar para crear variantes */
export function combinacionesVariants(
    arrays: number[][],
    indice = 0,
    combinacion: number[] = []
) {
    if (indice === arrays.length) return [combinacion];

    let resultado: number[][] = [];
    for (const item of arrays[indice]) {
        const combinacionTemp = [...combinacion];
        combinacionTemp.push(item);
        resultado = resultado.concat(
            combinacionesVariants(arrays, indice + 1, combinacionTemp)
        );
    }

    return resultado;
}

/* obtener variantes y opciones para reutilizar */
export async function getProductAll(
    information: InformationEntity,
    product: ProductsNormal | ProductsServicio | ProductsRestaurant
) {
    const [totalSold] = await Promise.all([
        DetailOrders.count({
            where: {
                product_id: product.id,
                information_id: information.id,
            },
            include: [
                {
                    model: Orders,
                    where: {
                        status_order_id: STATUSORDER.entregado,
                    },
                },
            ],
        }),
    ]);
    product.dataValues.totalSold = totalSold;
    return product;
}
export function printImagesProduct(
    images: FilesSchema[] | null,
    quality = 500
) {
    if (images) {
        return printFileWithDimension(images, quality);
    }
    return [`${enviroments.VITE_URL}/images/settings/others/no-profile.webp`];
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function deepEqual(obj1: any, obj2: any): boolean {
    // Comparación de igualdad directa
    if (obj1 === obj2) {
        return true;
    }
    // Verificación de null y tipo de objeto
    if (
        obj1 == null ||
        obj2 == null ||
        typeof obj1 !== "object" ||
        typeof obj2 !== "object"
    ) {
        return false;
    }
    // Obtención de las claves de los objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    // Comparación de la longitud de las claves
    if (keys1.length !== keys2.length) {
        return false;
    }
    // Comparación de los valores de las claves
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function areArraysEqual(array1: any[], array2: any[]): boolean {
    // Comparación de la longitud de los arrays
    if (array1.length !== array2.length) {
        return false;
    }
    // Comparación de los elementos del array
    for (let i = 0; i < array1.length; i++) {
        if (!deepEqual(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
}
type ArrayNoRepeat = {
    array1: number[];
    array2: number[];
    onDelete?: (props: number[]) => Promise<void>;
    onCreate?: (props: number[]) => Promise<void>;
};
export async function arrayNoRepeat({
    array1,
    array2,
    onDelete,
    onCreate,
}: ArrayNoRepeat) {
    const array1Set = new Set(array1);
    const array2Set = new Set(array2);
    if (
        array1Set.size === array2Set.size &&
        [...array1Set].every((id) => array2Set.has(id))
    ) {
    } else if (array1Set.size > array2Set.size) {
        const deleteIds = [...array1Set].filter((id) => !array2Set.has(id));
        if (onDelete) {
            await onDelete(deleteIds);
        }
    } else {
        const addedIds = [...array2Set].filter((id) => !array1Set.has(id));
        if (onCreate) {
            await onCreate(addedIds);
        }
    }
}

export type Products = {
    product_normal: ProductsNormalSchema | null;
    product_restaurant: ProductsRestaurantSchema | null;
    product_servicio: ProductsServicioSchema | null;
};
