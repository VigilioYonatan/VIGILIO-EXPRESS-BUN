import {
	coerce,
	date,
	maxLength,
	minLength,
	nullable,
	number,
	objectAsync,
	picklistAsync,
	string,
	stringAsync,
	type Input,
} from "valibot";

export const documentTypeSchema = picklistAsync(
	["DNI", "CE", "Pasaporte", "RUC"],
	"Tipo de Documento no válido",
);

export const typeOfConsumptionSchema = picklistAsync(
	["Producto", "Servicio"],
	"Tipo de consumo no válido",
);

export const typeComplaintSchema = picklistAsync(
	["Queja", "Reclamo"],
	"Tipo de queja no válido",
);

export const complaintsSchema = objectAsync({
	id: number(),
	fullName: string("El nombre completo es requerido.", [
		minLength(3, "El nombre completo debe tener al menos 3 caracteres."),
		maxLength(100, "El nombre completo debe tener como máximo 100 caracteres."),
	]),
	phone: stringAsync("El número de teléfono es requerido.", [
		minLength(9, "El número de teléfono debe tener al menos 9 caracteres."),
		maxLength(9, "El número de teléfono debe tener como máximo 9 caracteres."),
	]),
	typeOfDocument: documentTypeSchema,
	numberDocument: string("El número de documento es requerido.", [
		minLength(8, "El número de documento debe tener al menos 8 caracteres."),
		maxLength(
			11,
			"El número de documento debe tener como máximo 11 caracteres.",
		),
	]),
	email: string("El correo electrónico es requerido.", [
		minLength(3, "El correo electrónico debe tener al menos 3 caracteres."),
		maxLength(
			100,
			"El correo electrónico debe tener como máximo 100 caracteres.",
		),
	]),
	guardianName: nullable(string()),
	address: string("La dirección es requerida.", [
		minLength(3, "La dirección debe tener al menos 3 caracteres."),
		maxLength(100, "La dirección debe tener como máximo 100 caracteres."),
	]),
	typeComplaint: typeComplaintSchema,
	detailsOfComplaint: string("Los detalles de la queja son requeridos.", [
		minLength(
			30,
			"Los detalles de la queja deben tener al menos 3 caracteres.",
		),
	]),
	typeOfConsumption: typeOfConsumptionSchema,
	detailsOfConsumption: string("Los detalles del consumo son requeridos.", [
		minLength(
			30,
			"Los detalles del consumo deben tener al menos 3 caracteres.",
		),
	]),
	dateOfComplaint: nullable(
		coerce(date(), (value) => new Date(value as string)),
	),
});

export type DocumentType = Input<typeof documentTypeSchema>;
export type TypeComplaint = Input<typeof typeComplaintSchema>;
export type TypeConsumption = Input<typeof typeOfConsumptionSchema>;

export type ComplaintsSchema = Input<typeof complaintsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
