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

export const sunatGuideDto = objectAsync({
	version: string("Este campo es obligatorio."),
	tipoDoc: string("Este campo es obligatorio."),
	serie: string("Este campo es obligatorio."),
	correlativo: string("Este campo es obligatorio."),
	fechaEmision: coerce(date(), (value) => new Date(value as string)),
	destinatario: object({
		tipoDoc: string(),
		numDoc: string(),
		rznSocial: string(),
	}),
	envio: object({
		codTraslado: string(),
		modTraslado: string(),
		fecTraslado: coerce(date(), (value) => new Date(value as string)),
		pesoTotal: number(),
		undPesoTotal: string(),
		llegada: object({ ubigeo: string(), direccion: string() }),
		partida: object({ ubigeo: string(), direccion: string() }),
		transportista: object({
			tipoDoc: string(),
			numDoc: string(),
			rznSocial: string(),
		}),
	}),
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
	details: array(
		object({
			codigo: string("Este campo es obligatorio."),
			unidad: string("Este campo es obligatorio."),
			cantidad: number("Este campo es obligatorio."),
			descripcion: string("Este campo es obligatorio."),
		}),
	),
});
export type SunatGuideDto = Input<typeof sunatGuideDto>;
