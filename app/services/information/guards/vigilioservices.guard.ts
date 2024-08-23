import { attachMiddleware } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import enviroments from "~/config/enviroments.config";

export function VigilioServicesGuard() {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		target: any,
		propertyKey: string,
		_descriptor: PropertyDescriptor,
	) => {
		attachMiddleware(
			target,
			propertyKey,
			(req: Request, res: Response, next: NextFunction) => {
				const token = req.headers["access-token"];
				if (!token) {
					return res
						.status(404)
						.json({ success: false, message: "required token" });
				}
				if (token !== enviroments.VITE_TOKEN_VIGILIO_SERVICES) {
					return res.status(403).json({ success: false, message: "bad token" });
				}
				next();
			},
		);
	};
}
