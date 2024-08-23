import { Injectable } from "@vigilio/express-core";
import { Users } from "../entities/users.entity";
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
} from "@vigilio/express-core";
import { type UsersStoreDto } from "../dtos/users.store.dto";
import { type UsersUpdateDto } from "../dtos/users.update.dto";
import { removeFile } from "@/uploads/libs/helpers";
import { generateCodeEntity } from "~/libs/helpers";
import type { UsersProfileDto } from "../dtos/users.profile.dto";
import { Op } from "sequelize";
import bcryptjs from "bcryptjs";
import type { UsersPasswordDto } from "../dtos/users.password.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class UsersApiService {
    async index() {
        const data = await Users.scope("hiddePassword").findAll();
        return {
            success: true,
            data,
        };
    }

    async show(slug: string) {
        let user = null;
        if (!Number.isNaN(Number(slug))) {
            user = await Users.scope("hiddePassword").findByPk(Number(slug));
        } else {
            user = await Users.scope("hiddePassword").findOne({
                where: {
                    slug,
                },
            });
        }
        if (!user) {
            throw new NotFoundException(
                `No se encontró un usuario con ${slug}`
            );
        }
        return {
            success: true,
            user,
        };
    }

    async store(information: InformationEntity, usersStoreDto: UsersStoreDto) {
        const user = new Users({
            ...usersStoreDto,
            information_id: information.id,
        });
        user.user_code = await generateCodeEntity(
            Users,
            "user_code" as keyof Users,
            "USER"
        );
        user.password = bcryptjs.hashSync(usersStoreDto.password);
        await user.save();

        return {
            success: true,
            user,
        };
    }

    async update(id: string, usersUpdateDto: UsersUpdateDto) {
        const { user } = await this.show(id);
        if (user.id === 1)
            throw new BadRequestException(
                "No se puede modificar a este superadmin"
            );

        await user.update(usersUpdateDto);
        return {
            success: true,
            user,
        };
    }

    async changePassword(body: UsersPasswordDto, user: Users) {
        if (body.newPassword !== body.repeatNewPassword) {
            throw new BadRequestException("Contraseña no similares", {
                body: "repeatNewPassword" as keyof UsersPasswordDto,
            });
        }
        const findUser = await Users.findByPk(user.id, {
            attributes: ["password"],
        });
        if (!findUser)
            throw new InternalServerErrorException("Error de servidor");

        if (!bcryptjs.compareSync(body.passwordActual, findUser.password)) {
            throw new BadRequestException("Contraseña incorrecta", {
                body: "passwordActual" as keyof UsersPasswordDto,
            });
        }
        // cambiar de contraseña
        user.password = bcryptjs.hashSync(body.repeatNewPassword);
        await user.save();
        return {
            success: true,
            message: "Se cambió la contraseña correctamente",
        };
    }
    async profile(usersProfileDto: UsersProfileDto, user: Users) {
        const [byDni] = await Promise.all([
            Users.findOne({
                where: {
                    dni: usersProfileDto.dni,
                    id: { [Op.not]: user.id },
                },
                raw: true,
            }),
        ]);

        if (byDni) {
            throw new BadRequestException(
                `Este usuario con el dni ${usersProfileDto.dni} ya existe`,
                { body: "dni" as keyof UsersUpdateDto }
            );
        }

        await user.update(usersProfileDto);

        return {
            success: true,
            user,
        };
    }

    async destroy(id: string) {
        const { user } = await this.show(id);
        if (user.id === 1) {
            throw new BadRequestException(
                "No se puede eliminar al super-admin"
            );
        }
        await user.destroy();
        if (user.photo) {
            removeFile(user.photo);
        }
        return {
            success: true,
            message: `El usuario con el id: ${id} fue eliminado`,
        };
    }
}
