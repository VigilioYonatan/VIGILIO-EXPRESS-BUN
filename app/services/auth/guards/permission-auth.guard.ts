import { attachMiddleware } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { type AuthUser } from "../types";
import passport from "passport";

export function PermissionAuth() {
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
				// local
				if (req.isAuthenticated()) {
					const user = req.user as AuthUser;

					if (!user || !user.enabled) {
						return res.status(403).json({
							success: false,
							message:
								"No está permitido realizar esta acción, por  estar desabilitado",
						});
					}
					req.user = user;
					return next();
				}
				//  jwt
				passport.authenticate(
					"jwt",
					{ session: false },
					(err: Error, user: AuthUser) => {
						if (err || !user) {
							return res.status(401).json({
								success: false,
								message: "Unauthorized",
							});
						}
						if (!user || !user.enabled) {
							return res.status(403).json({
								success: false,
								message:
									"No está permitido realizar esta acción, por estar desabilitado",
							});
						}
						req.user = user;
						return next();
					},
				)(req, res, next);
			},
		);
	};
}
