import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    Controller,
    Get,
    Params,
    Post,
    Req,
    Res,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
} from "@vigilio/express-core";
import type { Response } from "express";
import { MessageMedia } from "whatsapp-web.js";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import path from "node:path";
import fs from "node:fs";
import formidable from "formidable";
import { clients, isWhatsappIA, openAis } from "../libs/ai";
import enviroments from "~/config/enviroments.config";
import type { InformationEntity } from "@/information/entities/information.entity";
import util from "node:util";
import { exec } from "node:child_process";
import type { RequestVigilio } from "~/config/types";
const execAsync = util.promisify(exec);

@Controller("/bot")
export class BotApiController {
    @PermissionAdmin()
    @Get("/qr")
    qr(@Res() res: Response) {
        const file = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "qrcode.png"
        );
        return res.sendFile(file);
    }
    @PermissionAdmin()
    @Post("/logout")
    async cerrarSession() {
        try {
            const dumpCommandStop = `pm2 stop ${enviroments.PM2_ID}`;
            await execAsync(dumpCommandStop);
            const file = path.resolve(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                "qrcode.png"
            );
            const whatsappauth = path.resolve(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                ".wwebjs_auth"
            );
            const whatsappcache = path.resolve(
                __dirname,
                "..",
                "..",
                "..",
                "..",
                ".wwebjs_cache"
            );
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
            if (fs.existsSync(whatsappauth)) {
                fs.rmSync(whatsappauth, { force: true, recursive: true });
            }
            if (fs.existsSync(whatsappcache)) {
                fs.rmSync(whatsappcache, { force: true, recursive: true });
            }
            const dumpCommand = `pm2 restart ${enviroments.PM2_ID}`;
            await execAsync(dumpCommand);
        } catch (error) {
            throw new BadRequestException(
                "error pm2 - comunicarse con empresa."
            );
        }
        return {
            success: true,
            message: "Eliminado correctamente",
        };
    }
    @PermissionAdmin()
    @Pipe(objectAsync({ telephone: string() }))
    @Post("/message/:telephone")
    async message(
        @Req() req: RequestVigilio,
        @Params("telephone") telephone: string
    ) {
        try {
            const information = req.information;
            const form = formidable();
            const [fields, files] = await form.parse(req);
            if (fields.message) {
                clients[information!.slug].sendMessage(
                    telephone,
                    fields.message[0],
                    {
                        sendMediaAsDocument: true,
                    }
                );
            }
            if (files.message) {
                const filePath = files.message[0].filepath;
                const bufferFile = Buffer.from(
                    fs.readFileSync(filePath)
                ).toString("base64");
                // delete filepath
                fs.unlinkSync(filePath);
                const file = await new MessageMedia(
                    files.message[0].mimetype!,
                    bufferFile,
                    files.message[0].originalFilename,
                    files.message[0].size
                );
                await clients[information!.slug].sendMessage(telephone, file);
            }
            return {
                success: true,
                message: "Se envió mensaje correctamente",
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Error en el sistema, dirigase al desarrollador"
            );
        }
    }

    @Pipe(objectAsync({ name: string() }))
    @Get("/description/:name")
    async description(
        @Params("name") name: string,
        @Req("information") information: InformationEntity
    ) {
        const whatsapp = await isWhatsappIA(information.slug);
        if (!whatsapp)
            throw new NotFoundException(
                "Hubo un problema al usar la ia, Recomiendo fijarse en los limites token"
            );
        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model:
                whatsapp.clientVigilio?.information.modelai ||
                enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    // insert custom prompt
                    content: `Dame solo la "descripcion" y no otro en formato de tienda virtual de producto de ${name} en español  y no traer fuentes y no menciones otra cosa que no sea la descripción, y sin comillas "" por favor`,
                },
            ],
        });
        const completionText = completion.choices[0].message.content;
        const latestInformationUsage = information!.inteligenceArtificial.usage;
        await information.update({
            ...information.inteligenceArtificial,
            usage: {
                ...latestInformationUsage,
                input_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        return {
            success: true,
            description: completionText,
        };
    }
    @Pipe(objectAsync({ color: string() }))
    @Get("/color/:color")
    async color(
        @Params("color") color: string,
        @Req("information") information: InformationEntity
    ) {
        const whatsapp = await isWhatsappIA(information.slug);
        if (!whatsapp)
            throw new NotFoundException(
                "Hubo un problema al usar la ia, Recomiendo fijarse en los limites token"
            );
        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model:
                whatsapp.clientVigilio?.information.modelai ||
                enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    // insert custom prompt
                    content: `Dame el color ${color} en hexadecimal, formato css`,
                },
            ],
        });
        const completionText = completion.choices[0].message.content!;
        const regexColor = completionText.match(/#[0-9a-fA-F]{3,6}/);
        if (!regexColor || !regexColor?.length) {
            throw new NotFoundException(
                `No se encontro color de ${color} o intente de nuevo`
            );
        }
        return {
            success: true,
            color: regexColor[0],
        };
    }
}
