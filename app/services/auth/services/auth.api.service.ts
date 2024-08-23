import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import enviroments from "~/config/enviroments.config";
import bcryptjs from "bcryptjs";
import crypto from "node:crypto";
import type { AuthForgotPasswordDto } from "../dtos/auth.forgot-password.dto";
import type { AuthConfirmPasswordDto } from "../dtos/auth.confirm-password.dto";
import { clients } from "@/bot/libs/ai";

@Injectable()
export class AuthApiService {
    async forgotPassword(authForgotPassword: AuthForgotPasswordDto) {
        const user = await Users.findOne({
            where: {
                email: authForgotPassword.email,
            },
        });
        if (!user)
            throw new BadRequestException(
                "No se encontró este correo electrónico en nuestro sistema",
                { body: "email" as keyof AuthForgotPasswordDto }
            );

        if (!user.enabled) {
            throw new BadRequestException("Tu cuenta no está habilitado");
        }
        const token = crypto.randomUUID();
        await user.update({ token });
        await clients[user.information.slug].sendMessage(
            `51${user.telephone}@c.us`,
            `Hola ${user.username}, Recupera tu contraseña aquí: ${enviroments.VITE_URL}/auth/forgot-password?token=${token}`
        );
        return {
            success: true,
            message: "Se envió un mensaje a tu numero de celular",
        };
    }

    async confirmPassword(authConfirmPasswordDto: AuthConfirmPasswordDto) {
        const user = await Users.findByPk(authConfirmPasswordDto.user_id);
        if (!user) throw new NotFoundException("Usuario no válido");
        const hashPassword = bcryptjs.hashSync(authConfirmPasswordDto.password);
        await user.update({ password: hashPassword });
        return {
            success: true,
            message: `Cambiaste tu contraseña correctamente <b>${user.username}</b>`,
        };
    }
}
