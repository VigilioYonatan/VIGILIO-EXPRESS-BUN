import { Injectable, NotFoundException } from "@vigilio/express-core";
import { Departments } from "../entities/departments.entity";
import { Provinces } from "../entities/provinces.entity";
import { Districts } from "../entities/districts.entity";
import type { DepartmentsUpdateDto } from "../dtos/departments.update.dto";

@Injectable()
export class UbigeoApiService {
	async departments() {
		const data = await Departments.findAll();
		return {
			success: true,
			data,
		};
	}
	async departmentsShow(ubigeo: string) {
		const department = await Departments.findByPk(ubigeo);
		if (!department)
			throw new NotFoundException("No se encontró departamento.");
		return {
			success: true,
			department,
		};
	}
	async departmentsUpdate(ubigeo: string, body: DepartmentsUpdateDto) {
		const { department } = await this.departmentsShow(ubigeo);
		await department.update(body);
		return {
			success: true,
			message: "Se actualizó departamento correctamente.",
		};
	}
	async provinces() {
		const data = await Provinces.findAll();
		return {
			success: true,
			data,
		};
	}
	async districts() {
		const data = await Districts.findAll();
		return {
			success: true,
			data,
		};
	}
	async districtsShow(ubigeo: string) {
		const data = await Districts.findByPk(ubigeo);
		if (!data) throw new NotFoundException(`No se encontró distrito ${ubigeo}`);
		return {
			success: true,
			data,
		};
	}
}
