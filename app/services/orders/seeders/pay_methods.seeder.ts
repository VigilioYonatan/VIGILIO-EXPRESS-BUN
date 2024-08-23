import type { PayMethodsSchema } from "../schemas/pay_methods.schema";

export const payMethodsSeeder: Omit<PayMethodsSchema, "id">[] = [
	{ name: "Efectivo" },
	{ name: "Tarjeta de Credito" },
	{ name: "Yape" },
	{ name: "Paypal" },
	{ name: "Transferencia" },
	{ name: "Otro" },
];
