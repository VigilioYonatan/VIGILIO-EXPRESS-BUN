import { Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Invoices } from "../entities/invoices.entity";
import type { InvoicesUpdateDto } from "../dtos/invoices.update.dto";
import type { InvoicesStoreDto } from "../dtos/invoices.store.dto";

@Injectable()
export class InvoicesApiService {
	async index() {
		const data = await Invoices.findAll();
		return {
			success: true,
			data,
		};
	}

	async latestCorrelativo(kind_invoice_code: string) {
		const latestInvoice = await Invoices.findOne({
			order: [["createdAt", "DESC"]],
			where: {
				kind_invoice_code,
			},
		});
		let correlativo = null;
		if (latestInvoice) {
			const ultimoNumero = Number.parseInt(latestInvoice.correlativo);
			correlativo = `${String(ultimoNumero + 1).padStart(6, "0")}`;
		} else {
			correlativo = "000001";
		}
		return { success: true, correlativo };
	}

	async show(serie_correlative: string) {
		let invoice = null;
		if (!Number.isNaN(Number(serie_correlative))) {
			invoice = await Invoices.findByPk(serie_correlative);
		} else {
			const [serie, correlativo] = serie_correlative.split("-");
			invoice = await Invoices.findOne({
				where: {
					serie,
					correlativo,
				},
			});
		}

		if (!invoice) {
			throw new NotFoundException(
				`No se encontró un boleta o factura con ${serie_correlative}`,
			);
		}

		return {
			success: true,
			invoice,
		};
	}

	async store(body: InvoicesStoreDto) {
		const invoice = new Invoices(body);
		await invoice.save();
		return {
			success: true,
			invoice,
		};
	}
	async update(serie_correlative: string, body: InvoicesUpdateDto) {
		const { invoice } = await this.show(serie_correlative);
		await invoice.update(body);
		return {
			success: true,
			invoice,
		};
	}
}
