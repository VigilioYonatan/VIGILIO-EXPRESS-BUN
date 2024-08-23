import { exec } from "node:child_process";
import util from "node:util";
import { BadRequestException, Injectable } from "@vigilio/express-core";
import { pathUploads } from "@/uploads/libs/helpers";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import dayjs from "~/libs/dayjs";

const execAsync = util.promisify(exec);
@Injectable()
export class BackupApiService {
    async backup() {
        const containerName = enviroments.DB_CONTAINER; // Cambia esto por el nombre de tu contenedor
        const username = enviroments.DB_USER;
        const dbname = enviroments.DB_NAME;
        const nameFile = `backup-${dayjs().format("DD-MM-YYYY.HH.mm.ss")}.sql`;

        const containerBackupPath = nameFile; // Ubicación del archivo de backup en el contenedor
        const hostBackupPath = `${pathUploads()}/backup`;
        if (!fs.existsSync(hostBackupPath)) {
            fs.mkdirSync(hostBackupPath);
        }
        const filesql = `${hostBackupPath}/${nameFile}`;

        // Comando para crear el backup dentro del contenedor
        const dumpCommand = `docker exec ${containerName} pg_dump -U ${username} -d ${dbname} -F c -f ${containerBackupPath}`;
        await execAsync(dumpCommand);

        // Comando para copiar el archivo de backup del contenedor al host
        const copyCommand = `docker cp ${containerName}:${containerBackupPath} ${filesql}`;
        await execAsync(copyCommand);
        const removeCommand = `docker exec ${containerName} rm ${containerBackupPath}`;
        await execAsync(removeCommand);
        return {
            success: true,
            message: "backup finalizado correctamente",
            file: `backup/${nameFile}`,
        };
    }

    async restart() {
        try {
            const dumpCommand = `pm2 restart ${enviroments.PM2_ID}`;
            await execAsync(dumpCommand);
        } catch (error) {
            throw new BadRequestException(
                "error pm2 - comunicarse con empresa."
            );
        }
    }
}
