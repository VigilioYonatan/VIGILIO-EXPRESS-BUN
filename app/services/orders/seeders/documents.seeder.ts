import type { DocumentsSchema } from "../schemas/documents.schema";

export const documentsSeeder: Omit<DocumentsSchema, "id">[] = [
	{ code: "1", name: "DNI" },
	{ code: "6", name: "RUC" },
];
