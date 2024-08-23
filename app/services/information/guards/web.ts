import type { Request } from "express";
import enviroments from "~/config/enviroments.config";

// prueba
export function getWebTechnologies() {
	return {
		technologies: [
			{
				id: 1,
				enabled: true,
				tokens: null,
				features: {
					clientes_registrados: 100,
					trabajadores_cantidad: 100,
					products_total: 100,
				},
			},
			{
				id: 2,
				date: "3025-07-07T00:00:00.000Z",
				enabled: true,
				tokens: null,
			},
			{
				id: 3,
				date: "3025-08-20T00:00:00.000Z",
				enabled: true,
				tokens: null,
			},
			{
				id: 4,
				date: "3025-08-30T00:00:00.000Z",
				enabled: true,
				tokens: 10000000,
			},
			{ id: 5, enabled: true },
			{ id: 6, enabled: true },
			{ id: 7, enabled: true },
		],
	};
}
export function getTechnologies(req: Request) {
	// local
	let technologies = null;
	if (enviroments.NODE_ENV !== "production") {
		technologies = getWebTechnologies();
	} else {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		technologies = (req as any).$web;
	}

	return technologies;
}
