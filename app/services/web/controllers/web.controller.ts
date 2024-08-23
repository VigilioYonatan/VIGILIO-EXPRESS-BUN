import {
    Controller,
    Get,
    Query,
    Res,
    Injectable,
    Information,
} from "@vigilio/express-core";
import type { Response } from "express";
import { WebService } from "../services/web.service";
import { webEnabledMiddleware } from "../middlewares/webEnabled.middleware";
import { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/")
export class WebController {
    constructor(private readonly webService: WebService) {}
    @Get("/hello-world")
    async helloworld(@Res() res: Response) {
        return res.send("<h1>Hello World!!!</h1>"); // no borrar
    }

    @Get("/")
    async home(@Res() res: Response) {
        const result = await this.webService.home();

        return res.render("web/home", result);
    }

    @Get("/404")
    async page404(@Query("message") message: string, @Res() res: Response) {
        res.status(404);
        return res.render("web/404", {
            title: "404",
            message: message ?? "No se a encontrado esta página",
        });
    }

    @Get("/pedidos")
    async orders(@Res() res: Response) {
        const result = await this.webService.orders();
        return res.render("web/orders", result);
    }

    @Get("/politica-de-privacidad", [webEnabledMiddleware])
    async politica(
        @Res() res: Response,
        @Information() information: InformationEntity
    ) {
        const result = await this.webService.politica(information);
        return res.render("web/politica/privacidad", result);
    }

    @Get("/terminos-y-condiciones", [webEnabledMiddleware])
    async terminos(
        @Res() res: Response,
        @Information() information: InformationEntity
    ) {
        const result = await this.webService.terminos(information);
        return res.render("web/politica/terminos", result);
    }

    @Get("/libro-de-reclamaciones", [webEnabledMiddleware])
    async reclamaciones(
        @Res() res: Response,
        @Information() information: InformationEntity
    ) {
        const result = await this.webService.reclamaciones(information);
        return res.render("web/politica/reclamaciones", result);
    }

    @Get("/goodbye")
    async goodbye(@Res() res: Response) {
        return res.send("<h1>goodbye!!!</h1>"); // no borrar
    }
}
