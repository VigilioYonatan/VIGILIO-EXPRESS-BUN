import { Injectable, Query } from "@vigilio/express-core";
import { Controller, Get, Req, Res } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
    authAuthenticatedMiddleware,
    authNoAuthenticatedMiddleware,
} from "../middlewares/auth.middleware";

@Injectable()
@Controller("/")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("/forgot-password", [authNoAuthenticatedMiddleware])
    async changePassword(
        @Res() res: Response,
        @Query("token") token: string | null
    ) {
        const result = await this.authService.forgotPassword(token);
        return res.render("auth/forgot-password", result);
    }

    @Get("/logout", [authAuthenticatedMiddleware])
    async logout(
        @Req() req: Request,
        @Res() res: Response,
        next: NextFunction
    ) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    }
}
