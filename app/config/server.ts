import express from "express";
import path from "node:path";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import enviroments from "~/config/enviroments.config";
import memoryStore from "memorystore";
import {
    ERROR_MIDDLEWARE,
    attachControllers,
    Container,
} from "@vigilio/express-core";
import { connectDB } from "~/config/db.config";
import { ServerErrorMiddleware } from "@vigilio/express-core/handler";
import { logger } from "@vigilio/express-core/helpers";
import { client } from "@vigilio/express-core/client";
import { apiRouters } from "~/routers/api.router";
import { webRouters } from "~/routers/web.router";
import { authRouters } from "~/routers/auth.router";
import { middlewareRoute } from "~/libs/middleware-route";
import { initializeClients } from "@/bot/libs/ai";
import { localStrategy } from "@/auth/strategies/local.strategy";
import { InformationEntity } from "@/information/entities/information.entity";

export class Server {
    public readonly app: express.Application = express();

    constructor() {
        this.middlewares();
        this.auth();
        this.routes();
        // Llama a la función para inicializar las instancias
        initializeClients();
    }
    middlewares() {
        // comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
        this.app.use(
            compression({
                threshold: 10000,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        this.app.use(async (req, res, next) => {
            const host = req.headers.host;
            const subdomain = host?.split(".")[0]; // Obtiene el subdominio

            const information = await InformationEntity.findOne({
                where: {
                    name: subdomain?.replaceAll("_", " "),
                },
            });
            if (information) {
                next();
            } else {
                res.status(404).send("Subdominio no encontrado");
            }
        });
        // habilitar cookies
        this.app.use(cookieParser());
        // habilitar para consumir json
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.json());
        // habilitar carpeta public
        this.app.use(
            express.static(path.resolve(import.meta.dir, "..", "..", "public"))
        );
        // habilitar para consumir vistas
        this.app.set("view engine", "ejs");
        this.app.set(
            "views",
            path.resolve(import.meta.dir, "..", "..", "resources", "views")
        );
        // vite js configuración
        this.app.use(client());
        // metodos globales

        connectDB();
    }

    async auth() {
        this.app.set("trust proxy", 1);
        // cachear session para mejor rendimiento de las sessiones
        const memoryStoreClass = memoryStore(session);
        // https://www.passportjs.org/concepts/authentication/sessions/
        const closeSession = 24 * 60 * 60 * 1000 * 7; // 7 dias
        this.app.use(
            session({
                secret: enviroments.SECRET_SESSION_KEY,
                resave: false,
                saveUninitialized: false,
                proxy: enviroments.NODE_ENV === "production", // NODE_ENV === 'production'
                cookie: {
                    secure: enviroments.NODE_ENV === "production", //true in production
                    httpOnly: true,
                    maxAge: closeSession, // 15 dia
                },
                store: new memoryStoreClass({
                    checkPeriod: closeSession,
                }),
            })
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // strategies
        passport.use(localStrategy());
        passport.serializeUser((information, done) => {
            return done(null, information);
        });
        passport.deserializeUser(
            async (information: InformationEntity, done) => {
                const findInformation = await InformationEntity.findByPk(
                    information.id,
                    {
                        attributes: {
                            exclude: [
                                "contacts",
                                "groupWhatsapp",
                                "password",
                                "token",
                            ],
                        },
                    }
                );
                if (!findInformation)
                    return done({ message: "error authenticated" });
                return done(null, findInformation);
            }
        );
    }

    routes() {
        this.app.use(morgan("dev"));
        const apiRouter = express.Router();
        const webRouter = express.Router();
        const authRouter = express.Router();
        attachControllers(apiRouter, apiRouters);
        attachControllers(webRouter, webRouters);
        attachControllers(authRouter, authRouters);
        Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
        ]);
        this.app.use("/", webRouter);
        this.app.use("/auth", authRouter);
        this.app.use("/api", apiRouter);
        this.app.use(middlewareRoute);
    }
    listen() {
        const server = this.app.listen(enviroments.PORT, () => {
            logger.primary(`Run server in port ${enviroments.PORT}`);
        });
        return server;
    }
}
