import { InformationEntity } from "@/information/entities/information.entity";
import type { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import enviroments from "~/config/enviroments.config";
import type { Money } from "~/libs/helpers";

export function subtotal(price: number, discount: number, increase = false) {
    if (increase) {
        return price + (discount * price) / 100;
    }
    return price - (discount * price) / 100;
}
export function formatSoles(number: number) {
    return number.toLocaleString("es-PE", {
        style: "currency",
        currency: "PEN",
    });
}
export function formatMoney(number: number, money: Money) {
    return money === "SOLES"
        ? formatSoles(number)
        : number.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
          });
}

export function calculatePorcentajeDiscount(initial: number, final: number) {
    const porcentajeDescuento = ((initial - final) / initial) * 100;
    return Number(porcentajeDescuento.toFixed()); //
}

export function redondeo(total: number) {
    return Math.floor(total * 10) / 10;
}
export function subtotalIgv(
    information: InformationEntity,
    product: ProductsNormal | ProductsServicio | ProductsRestaurant
) {
    const subtotalProduct = subtotal(
        product.price,
        //   si no tiene ganancia en producto. tomará por defecto la de configuración
        product.earning ?? information.earning,
        true
    );
    const subDiscount = subtotal(subtotalProduct, product.discount);
    return information!.igv
        ? subtotal(subDiscount, enviroments.VITE_IGV, true)
        : subDiscount;
}
