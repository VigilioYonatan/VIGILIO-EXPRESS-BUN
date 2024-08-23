import enviroments from "~/config/enviroments.config";

export async function rucV1Api(ruc: string) {
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_WEB}/api/v1/peru/ruc/${ruc}`,
		{
			headers: {
				"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
			},
		},
	);
	const result: RucV1API = await response.json();
	return result;
}

export interface RucV1API {
	success: boolean;
	message: string;
	ruc: string;
	dni: string;
	tipo_ruc: string;
	razon_social: string;
	estado: string;
	habido: string;
	ubigeo: string;
	direccion: string;
	departamento: string;
	provincia: string;
	distrito: string;
	link: string;
}
