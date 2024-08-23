import { Injectable } from "@vigilio/express-core";
import { Notifications } from "../entities/notifications.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsUser } from "../entities/notifications_user.entity";
import type { NotificationsSchema } from "../schemas/notifications.schema";
import type { Subscription } from "@/users/schemas/users.schema";

@Injectable()
export class NotificationsApiService {
    async count(user: Users) {
        const data = await NotificationsUser.count({
            where: {
                user_id: user.id,
                isRead: false,
            },
        }); // only notifications that no read
        return {
            success: true,
            data,
        };
    }
    async clean(user: Users) {
        const notifications = await NotificationsUser.findAll({
            where: {
                user_id: user.id,
                isRead: false,
            },
        });
        for (const notification of notifications) {
            await notification.update({ isRead: true });
        }
        return {
            success: true,
            message: "Se limpiaron todas tus notificaiones",
        };
    }
    async show(id: string) {
        let notification = null;
        if (!Number.isNaN(Number(id))) {
            notification = await Notifications.findByPk(id);
        }
        if (!notification) {
            throw new NotFoundException(
                `No se encontró una notificación con ${id}`
            );
        }
        return {
            success: true,
            notification,
        };
    }
    async register(user: Users, subscription: Subscription) {
        await user.update({ subscription });
        return {
            success: true,
            id: user.id,
        };
    }
    async store(notificationsStoreDto: Omit<NotificationsSchema, "id">) {
        const notification = new Notifications(notificationsStoreDto);
        await notification.save();
        const user = await notification.$get("usernotifications");
        return {
            success: true,
            notification: { ...notification.toJSON(), user },
        };
    }

    async update(
        user: Users,
        body: {
            notification_id: number;
            isRead: boolean;
        }
    ) {
        const notification = await NotificationsUser.findOne({
            where: {
                notification_id: body.notification_id,
                user_id: user.id,
            },
        });
        if (!notification)
            throw new BadRequestException("No se encontró notificación");
        await notification.update({ isRead: body.isRead });
        return {
            success: true,
            notification,
        };
    }

    async destroy(id: string) {
        const { notification } = await this.show(id);
        await notification.destroy();
        return {
            success: true,
            message: `La notificación con el id: ${id} fue eliminado`,
        };
    }
}
