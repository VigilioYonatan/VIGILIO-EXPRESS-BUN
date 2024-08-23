import { Injectable } from "@vigilio/express-core";
import { Users } from "@/users/entities/users.entity";
import { NotificationsApiService } from "@/notificactions/services/notifications.api.service";
import { NotificationsUser } from "@/notificactions/entities/notifications_user.entity";
import webpush from "@/notificactions/libs/webpush";
import { removeTextHTML } from "~/libs/helpers";
import enviroments from "~/config/enviroments.config";
import { InformationEntity } from "@/information/entities/information.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";

@Injectable()
export class WebsocketsService {
    constructor(
        private readonly notificationsApiService: NotificationsApiService
    ) {}
    async index(token: string) {
        const tkn = JSON.parse(token ?? "null");
        if (!tkn) return;
        const user = await Users.unscoped().findByPk(tkn, {
            attributes: ["id", "username", "role_id", "isOnline"],
        });
        return user;
    }

    async orderStore(body: {
        information_id: number;
        order_code: string;
        total: number;
    }) {
        const information = await InformationEntity.findByPk(
            body.information_id,
            {
                attributes: ["id", "logo"],
            }
        );
        const content = `Se registró una nueva orden registrado <b>S/.${body.total}</b>`;
        const payload = {
            title: `Nueva orden registrada ${body.order_code}`,
            message: removeTextHTML(content), // Asegúrate de que content sea el mensaje que quieres enviar
            url: `${enviroments.VITE_URL}/admin/orders/${body.order_code}`, // URL dinámica
            logo: information!.logo
                ? printFileWithDimension(information!.logo, 100)[0]
                : "",
            tag: "nueva-orden",
        };
        const notification = await this.notificationsApiService.store({
            type: "order",
            url: `/admin/orders/${body.order_code}`,
            content,
            information_id: body.information_id,
        });
        const users = await Users.findAll({
            where: { information_id: body.information_id },
        });

        await Promise.all(
            users.map(async (user) => {
                const noti = new NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    isRead: false,
                });
                await noti.save();
                if (user.subscription && user.enabledNotification) {
                    await webpush.sendNotification(
                        user.subscription,
                        JSON.stringify(payload)
                    );
                }
            })
        );

        return notification;
    }
}
