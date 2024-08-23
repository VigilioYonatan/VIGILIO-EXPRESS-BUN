import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { DetailOrders } from "../entities/detail_orders.entity";
import type { DetailOrdersStoreDto } from "../dtos/detail_orders.store.dto";
import type { DetailOrdersUpdateDto } from "../dtos/detail_orders.update.dto";

@Injectable()
export class DetailOrdersApiService {
	async index() {
		const data = await DetailOrders.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(id: string) {
		let detailOrder = null;
		if (!Number.isNaN(Number(id))) {
			detailOrder = await DetailOrders.findByPk(id);
		}
		if (!detailOrder) {
			throw new NotFoundException(`No se encontró un orden con ${id}`);
		}
		return {
			success: true,
			detailOrder,
		};
	}

	async store(detailOrdersStoreDto: DetailOrdersStoreDto) {
		const detailOrder = new DetailOrders(detailOrdersStoreDto);
		await detailOrder.save();
		return {
			success: true,
			detailOrder,
		};
	}

	async update(id: string, detailOrdersUpdateDto: DetailOrdersUpdateDto) {
		const { detailOrder } = await this.show(id);
		await detailOrder.update(detailOrdersUpdateDto);
		return {
			success: true,
			detailOrder,
		};
	}

	async destroy(id: string) {
		const { detailOrder } = await this.show(id);
		await detailOrder.destroy();
		return {
			success: true,
			message: `El orden con el id: ${id} fue eliminado`,
		};
	}
}
