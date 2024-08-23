import { Injectable } from "@vigilio/express-core";
import type { NotesStoreDto } from "../dtos/notes.store.dto";
import { Notes } from "../entities/notes.entity";
import type { NotesUpdateDto } from "../dtos/note.update.dto";
import { NotFoundException } from "@vigilio/express-core";
@Injectable()
export class NotesApiService {
	async latestCorrelativo(kind_invoice_code: string) {
		const latestNote = await Notes.findOne({
			order: [["createdAt", "DESC"]],
			where: {
				kind_invoice_code,
			},
		});
		let correlativo = null;
		if (latestNote) {
			const ultimoNumero = Number.parseInt(latestNote.correlativo);
			correlativo = `${String(ultimoNumero + 1).padStart(6, "0")}`;
		} else {
			correlativo = "000001";
		}
		return { success: true, correlativo };
	}

	async show(serie_correlative: string) {
		let invoice = null;
		if (!Number.isNaN(Number(serie_correlative))) {
			invoice = await Notes.findByPk(serie_correlative);
		} else {
			const [serie, correlativo] = serie_correlative.split("-");
			invoice = await Notes.findOne({
				where: {
					serie,
					correlativo,
				},
			});
		}

		if (!invoice) {
			throw new NotFoundException(
				`No se encontró una nota de credito o debito con ${serie_correlative}`,
			);
		}

		return {
			success: true,
			invoice,
		};
	}
	async store(body: NotesStoreDto) {
		const invoice = new Notes(body);
		await invoice.save();
		return {
			success: true,
			invoice,
		};
	}
	async update(serie_correlative: string, body: NotesUpdateDto) {
		const { invoice } = await this.show(serie_correlative);
		await invoice.update(body);
		return {
			success: true,
			invoice,
		};
	}
}
