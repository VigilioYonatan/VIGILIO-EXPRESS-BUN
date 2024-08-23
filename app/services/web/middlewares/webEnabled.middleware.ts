import { printFileWithDimension } from "@/uploads/libs/helpers";
import type { NextFunction, Request, Response } from "express";
import type { RequestVigilio } from "~/config/types";

export async function webEnabledMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!(req as RequestVigilio).information?.enabled) {
		const html = /*html*/ `<div style="width:100%;height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;">
                                    <h1>En este momento no estamos no estamos disponible</h1>
                                    <img src="${printFileWithDimension(
																			(req as RequestVigilio).information!
																				.logo!,
																			100,
																		)}" width="100" height="100" style=""/>
                                    <a href="https://wa.me/51${
																			(req as RequestVigilio).information
																				?.telephoneFirst
																		}" _target="blank">Comunicate con nosotros ${
																			(req as RequestVigilio).information
																				?.telephoneFirst
																		}</a>
                                </div>`;
		// if web no is enabled
		return res.send(html);
	}
	next();
}
