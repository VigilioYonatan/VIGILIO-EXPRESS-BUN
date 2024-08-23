import type { KindInvoiceSchema } from "../schemas/kind_invoice.schema";

export const kindInvoiceSeeder: Omit<KindInvoiceSchema, "id">[] = [
	{ code: "00", name: "Ticket" },
	{ code: "01", name: "Factura" },
	{ code: "03", name: "Boleta" },
	{ code: "07", name: "Nota de Crédito" },
	{ code: "08", name: "Nota de Débito" },
	{ code: "09", name: "Guía de remisión" },
	{ code: "31", name: "Guía de remisión transportista" },
];
