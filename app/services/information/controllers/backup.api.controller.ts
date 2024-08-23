import {
    Controller,
    Get,
    Params,
    Post,
    Injectable,
    Res,
    InternalServerErrorException,
    Req,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { BackupApiService } from "../services/backup.api.service";
import { custom, string } from "@vigilio/valibot";
import type { Response } from "express";
import archiver from "archiver";
import { pathUploads } from "@/uploads/libs/helpers";
import type { InformationEntity } from "../entities/information.entity";
import fs from "node:fs";
import { VigilioServicesGuard } from "../guards/vigilioservices.guard";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/backup")
export class BackupApiController {
    constructor(private readonly backupsApiService: BackupApiService) {}

    @VigilioServicesGuard()
    @Pipe(
        objectAsync({
            type: string([
                custom(
                    (val) => ["backup", "files", "restart"].includes(val),
                    "type error: backup,files,restart "
                ),
            ]),
        })
    )
    @Post("/vigilio/:type")
    async vigilio(
        @Params("type") type: "backup" | "files" | "restart",
        @Res() res: Response,
        @Req("information") information: InformationEntity
    ) {
        switch (type) {
            case "backup": {
                const result = await this.backupsApiService.backup();
                if (fs.existsSync(`${pathUploads()}/${result.file}`)) {
                    res.download(
                        `${pathUploads()}/${result.file}`,
                        result.file.split("/").at(-1) ?? "backup.sql",
                        (err) => {
                            if (err) {
                                console.error(
                                    "Error al enviar el archivo:",
                                    err
                                );
                                res.status(500).send(
                                    "Error al enviar el archivo"
                                );
                            }
                        }
                    );
                } else {
                    res.status(404).send("Archivo no encontrado");
                }
                break;
            }
            case "restart": {
                const result = await this.backupsApiService.restart();
                return result;
            }
            case "files": {
                res.setHeader(
                    "Content-Disposition",
                    `attachment; filename=${information.name_empresa}-archivos.zip`
                );
                res.setHeader("Content-Type", "application/zip");
                const archive = archiver("zip", {
                    zlib: { level: 9 }, // Nivel de compresión
                });
                archive.on("error", (err) => {
                    throw new InternalServerErrorException(err.message);
                });
                archive.pipe(res);
                archive.directory(pathUploads(), false);
                archive.finalize();
                break;
            }

            default:
                break;
        }
    }

    @PermissionAdmin()
    @Get("/files")
    async backsql(
        @Res() res: Response,
        @Req("information") information: InformationEntity
    ) {
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${information.name_empresa}-archivos.zip`
        );
        res.setHeader("Content-Type", "application/zip");
        const archive = archiver("zip", {
            zlib: { level: 9 }, // Nivel de compresión
        });
        archive.on("error", (err) => {
            throw new InternalServerErrorException(err.message);
        });
        archive.pipe(res);
        archive.directory(pathUploads(), false);
        archive.finalize();
    }
}
