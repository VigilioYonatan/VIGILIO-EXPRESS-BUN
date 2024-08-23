import { companySchema } from "@/information/schemas/information.schema";
import {
	array,
	object,
	objectAsync,
	string,
	nullable,
	type Input,
	coerce,
	date,
	number,
	mergeAsync,
} from "@vigilio/valibot";

export const sunatNoteDto = objectAsync({
	ublVersion: string("Este campo es obligatorio."),
	tipoOperacion: string("Este campo es obligatorio."),
	tipoDoc: string("Este campo es obligatorio."),
	serie: string("Este campo es obligatorio."),
	correlativo: string("Este campo es obligatorio."),
	tipDocAfectado: string("Este campo es obligatorio"),
	numDocfectado: string("Este campo es obligatorio"),
	codMotivo: string("Este campo es obligatorio"),
	desMotivo: string("Este campo es obligatorio"),
	fechaEmision: coerce(date(), (value) => new Date(value as string)),
	formaPago: object({
		moneda: string("Este campo es obligatorio."),
		tipo: string("Este campo es obligatorio."),
	}),
	tipoMoneda: string("Este campo es obligatorio."),
	company: mergeAsync([
		companySchema,
		object({
			// ruc: string("Este campo es obligatorio."),
			// razonSocial: string("Este campo es obligatorio."),
			// nombreComercial: string("Este campo es obligatorio."),
			telephone: string(),
			logo: string(),
			certificado: nullable(string()),
			condicion_pago: string(), //efectivo
			vendedor: string(), //efectivo
			address: object({
				ubigeo: string("Este campo es obligatorio."),
				departamento: string("Este campo es obligatorio."),
				provincia: string("Este campo es obligatorio."),
				distrito: string("Este campo es obligatorio."),
				urbanizacion: string("Este campo es obligatorio."),
				direccion: string("Este campo es obligatorio."),
				codLocal: string("Este campo es obligatorio."),
			}),
		}),
	]),
	client: object({
		tipoDoc: string("Este campo es obligatorio."),
		numDoc: string("Este campo es obligatorio."),
		rznSocial: string("Este campo es obligatorio."),
	}),
	details: array(
		object({
			tipAfeIgv: number("Este campo es obligatorio."),
			codProducto: string("Este campo es obligatorio."),
			unidad: string("Este campo es obligatorio."),
			cantidad: number("Este campo es obligatorio."),
			mtoValorUnitario: number("Este campo es obligatorio."),
			descripcion: string("Este campo es obligatorio."),
			mtoBaseIgv: number("Este campo es obligatorio."),
			porcentajeIgv: number("Este campo es obligatorio."),
			igv: number("Este campo es obligatorio."),
			mtoValorVenta: number("Este campo es obligatorio."),
			totalImpuestos: number("Este campo es obligatorio."),
			mtoPrecioUnitario: number("Este campo es obligatorio."),
			factorIcbper: nullable(number("Este campo es obligatorio.")),
			icbper: nullable(number("Este campo es obligatorio.")),
		}),
	),
});
export type SunatNoteDto = Input<typeof sunatNoteDto>;
