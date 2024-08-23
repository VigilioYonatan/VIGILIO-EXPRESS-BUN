import passport from "passport";
import { Controller, Post } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { Injectable } from "@vigilio/express-core";
import { type AuthUserLogin } from "../types";

@Injectable()
@Controller("/auth")
export class AuthApiController {
    @Post("/login", [
        (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate(
                "local",
                (
                    err: Error,
                    user: AuthUserLogin,
                    message: { message: string }
                ) => {
                    if (err) {
                        return next(err);
                    }

                    if (!user) {
                        return res
                            .status(401)
                            .json({ success: false, ...message });
                    }

                    req.logIn(user, (err) => {
                        if (err) {
                            return next(err);
                        }

                        return res.status(200).json({
                            success: true,
                            user,
                        });
                    });
                }
            )(req, res, next);
        },
    ])
    login() {}
}
