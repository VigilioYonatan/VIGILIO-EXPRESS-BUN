import type { StatusOrdersSchema } from "../schemas/status_orders.schema";

export const statusOrdersSeeder: Omit<StatusOrdersSchema, "id">[] = [
	{ name: "Pendiente" },
	{ name: "Confirmado" },
	{ name: "Preparado" },
	{ name: "Enviando" },
	{ name: "Pagado Correctamente" },
	{ name: "Entregado Correctamente" },
	{ name: "Hubo un problema" },
];
