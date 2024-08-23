import type { KindDebitNotesSchema } from "../schemas/kind_debit_notes.schema";

export const kindDebitNotesSeeder: Omit<KindDebitNotesSchema, "id">[] = [
	{ code: "01", name: "Intereses por mora." },
	{ code: "02", name: "Aumento en el valor." },
	{ code: "03", name: "Penalidades en el valor." },
];
