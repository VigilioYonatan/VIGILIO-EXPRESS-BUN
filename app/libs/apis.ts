import enviroments from "~/config/enviroments.config";

export interface ConverterBody {
	amount: string;
	from: string;
	to: string;
}

export async function converterMoneyApi(body: ConverterBody) {
	const data = new URLSearchParams();
	data.append("amount", body.amount);
	data.append("from", body.from);
	data.append("to", body.to);
	const response = await fetch(
		`${enviroments.VITE_VIGILIO_WEB}/api/peru/converter-money?${data}`,
		{
			headers: {
				"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
			},
		},
	);
	const result: converterMoneyAPI = await response.json();
	if (!result.success) throw result;
	return result;
}
interface converterMoneyAPI {
	success: true;
	result: {
		resultado: string;
		today: string;
		resultadoNumber: string;
		todayNumber: string;
	};
}
