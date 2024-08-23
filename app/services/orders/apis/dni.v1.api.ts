import enviroments from "~/config/enviroments.config";

export async function dniV1Api(dni: string) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_WEB}/api/v1/peru/dni/${dni}`,
		{
			headers: {
				"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
			},
		},
	);
	const result: DniV1API = await response.json();
	return result;
}

export interface DniV1API {
	success: boolean;
	message: string;
	nombre: string;
	tipoDocumento: string;
	numeroDocumento: string;
	estado: string;
	condicion: string;
	direccion: string;
	ubigeo: string;
	viaTipo: string;
	viaNombre: string;
	zonaCodigo: string;
	zonaTipo: string;
	numero: string;
	interior: string;
	lote: string;
	dpto: string;
	manzana: string;
	kilometro: string;
	distrito: string;
	provincia: string;
	departamento: string;
	apellidoPaterno: string;
	apellidoMaterno: string;
	nombres: string;
}
