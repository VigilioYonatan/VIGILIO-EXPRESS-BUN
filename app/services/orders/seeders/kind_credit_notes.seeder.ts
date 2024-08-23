import type { KindCreditNotesSchema } from "../schemas/kind_credit_notes.schema";

export const kindCreditNotesSeeder: Omit<KindCreditNotesSchema, "id">[] = [
	{ code: "01", name: "Anulacion de la operación." },
	{ code: "02", name: "Anulacion por error en el RUC." },
	{ code: "03", name: "Corrección por error en la descripción." },
	{ code: "04", name: "Descuento global." },
	{ code: "05", name: "Descuento por ítem." },
	{ code: "06", name: "Devolución total." },
	{ code: "07", name: "Devolución por ítem." },
	{ code: "08", name: "Bonificación." },
	{ code: "09", name: "Disminución en el valor." },
	{ code: "10", name: "Otros conceptos." },
];
