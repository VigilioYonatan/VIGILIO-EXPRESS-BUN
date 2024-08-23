import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { StatusOrders } from "../entities/status_orders.entity";
import type { StatusOrdersStoreDto } from "../dtos/status_orders.store.dto";
import type { StatusOrdersUpdateDto } from "../dtos/status_orders.update.dto";

@Injectable()
export class StatusOrdersApiService {
	async index() {
		const data = await StatusOrders.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(id: string) {
		let order = null;
		if (!Number.isNaN(Number(id))) {
			order = await StatusOrders.findByPk(id);
		}
		if (!order) {
			throw new NotFoundException(`No se encontró un  estatus orden con ${id}`);
		}
		return {
			success: true,
			order,
		};
	}

	async store(statusOrdersStoreDto: StatusOrdersStoreDto) {
		const order = new StatusOrders(statusOrdersStoreDto);
		await order.save();
		return {
			success: true,
			order,
		};
	}

	async update(id: string, statusOrdersUpdateDto: StatusOrdersUpdateDto) {
		const { order } = await this.show(id);
		await order.update(statusOrdersUpdateDto);
		return {
			success: true,
			order,
		};
	}

	async destroy(id: string) {
		const { order } = await this.show(id);
		await order.destroy();
		return {
			success: true,
			message: `El  estatus orden con el id: ${id} fue eliminado`,
		};
	}
}
