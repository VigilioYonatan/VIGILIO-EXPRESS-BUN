import { Controller, Get, Query, Res, Injectable } from "@vigilio/express-core";
import { CartService } from "../services/cart.service";
import type { Response } from "express";

@Injectable()
@Controller("/cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}
	@Get("/")
	async index(@Res() res: Response, @Query("items") items: string) {
		let itemsResult: { id: number; quantity: number }[] | null = null;

		if (items) {
			try {
				itemsResult = JSON.parse(items) as {
					id: number;
					quantity: number;
				}[];
			} catch (error) {
				return res.redirect("/");
			}
		}
		const result = await this.cartService.index(itemsResult);
		return res.render("web/cart", result);
	}
}
