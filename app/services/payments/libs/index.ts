import { subtotal } from "@/cart/libs/helpers";
import enviroments from "~/config/enviroments.config";

export function pasarelaComision(monto: number) {
	const tasaIziPay = enviroments.VITE_PASARELA_COMISION / 100;
	const tasaIGV = enviroments.VITE_PASARELA_COMISION_IMPUESTO / 100;

	const comisionIziPay = monto * tasaIziPay;
	const igvIziPay = comisionIziPay * tasaIGV;

	const igvCanalVirtual =
		enviroments.VITE_PASARELA_COMISION_TRANSACCION * tasaIGV;

	const comisionTotal =
		comisionIziPay +
		igvIziPay +
		enviroments.VITE_PASARELA_COMISION_TRANSACCION +
		igvCanalVirtual;

	return comisionTotal;
}
export function paypalComision(monto: number, dolarNow: number) {
	return (
		subtotal(monto / dolarNow, enviroments.VITE_PAYPAL_COMISION, true) +
		enviroments.VITE_PAYPAL_TRANSACTION
	);
}
