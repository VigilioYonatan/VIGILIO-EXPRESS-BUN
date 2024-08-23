import { Injectable } from "@vigilio/express-core";
import { PayMethods } from "../entities/pay_methods.entity";
import { NotFoundException } from "@vigilio/express-core";

@Injectable()
export class PayMethodsApiService {
	async index() {
		const data = await PayMethods.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(id: string) {
		let order = null;
		if (!Number.isNaN(Number(id))) {
			order = await PayMethods.findByPk(id);
		}
		if (!order) {
			throw new NotFoundException(`No se encontró un orden con ${id}`);
		}
		return {
			success: true,
			order,
		};
	}
}
