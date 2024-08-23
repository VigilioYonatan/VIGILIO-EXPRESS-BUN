import { Injectable } from "@vigilio/express-core";

@Injectable()
export class CartService {
	async index(items: { id: number; quantity: number }[] | null) {
		return {
			title: "Carrito",
			cart: items,
		};
	}
}
