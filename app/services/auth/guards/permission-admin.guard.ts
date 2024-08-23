import { attachMiddleware } from "@vigilio/express-core";
import { type NextFunction, type Request, type Response } from "express";
import passport from "passport";
import { ROLES } from "@/users/libs";
import type { Users } from "@/users/entities/users.entity";

export function PermissionAdmin() {
    return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        target: any,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            (req: Request, res: Response, next: NextFunction) => {
                // local
                if (req.isAuthenticated()) {
                    const user = req.user as Users;
                    if (user.role_id !== ROLES.admin || !user.enabled) {
                        return res.status(403).json({
                            success: false,
                            message:
                                "No está permitido realizar esta acción solo admin",
                        });
                    }
                    return next();
                }
                //  jwt
                passport.authenticate(
                    "jwt",
                    { session: false },
                    (err: Error, user: Users) => {
                        if (err || !user) {
                            return res.status(401).json({
                                success: false,
                                message: "Unauthorized",
                            });
                        }
                        if (user.role_id !== ROLES.admin || !user.enabled) {
                            return res.status(403).json({
                                success: false,
                                message:
                                    "No está permitido realizar esta acción solo admin",
                            });
                        }
                        req.user = user;
                        return next();
                    }
                )(req, res, next);
            }
        );
    };
}
