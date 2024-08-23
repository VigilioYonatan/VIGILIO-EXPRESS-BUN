import {
    Args,
    Connect,
    SocketController,
    Disconnect,
    Event,
    IO,
    Socket,
} from "@vigilio/express-core";
import * as socket from "socket.io";
import { WebsocketsService } from "../services/websockets.service";
import { chatAssistant, cloudeAi } from "@/bot/libs/ai";
import { Injectable } from "@vigilio/express-core";

let usersInWeb: string[] = [];

@Injectable()
@SocketController("/")
export class WebsocketsController {
    constructor(private readonly websocketsService: WebsocketsService) {}

    @Disconnect()
    async disconnect(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        if (!token) return;
        usersInWeb = usersInWeb.filter((user) => user !== token);
        io.emit("users-count:index", usersInWeb.length);
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        if (user?.isOnline) {
            // update user
            await user.update({ isOnline: false });
        }
    }

    @Connect()
    async index(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
        // token localstorage
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        if (!token) return;
        // user - user auth
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        // unir en la sala
        socket.join(token);
        if (user) {
            // update user
            if (!user.isOnline) {
                await user.update({ isOnline: true });
            }
            socket.join(user.id);
            if (!chatAssistant[user.id]?.length) {
                chatAssistant[user.id] = [
                    [
                        "assistant",
                        `Hola ${user.username}, Soy tu asistente virtual 😀. ¿En que  podriamos ayudarte?`,
                        Date.now(),
                    ],
                ];
            }
            io.to(user.id).emit("chat-assistant:ai", chatAssistant[user.id]);
        }
        const existUserInWeb = usersInWeb.find((user) => user === token);
        if (!existUserInWeb) {
            // si no existe usuari con el mismo token que ya no agregre
            usersInWeb = [...usersInWeb, token]; // add user
        }

        io.emit("users-count:index", usersInWeb.length);
    }

    @Event("notifications:order-store")
    async orderStore(
        @Args()
        body: {
            information_id: number;
            order_code: string;
            total: number;
        },
        @IO() io: socket.Socket
    ) {
        const result = await this.websocketsService.orderStore(body);
        io.emit("notifications:store", result);
    }

    @Event("chat-assistant:send-message")
    async sendAssistantMessage(
        @Args() args: { message: string },
        @Socket() socket: socket.Socket,
        @IO() io: socket.Socket
    ) {
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        if (!token) return;

        // user - user auth
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        if (!user) return;
        const message = await cloudeAi(
            user!.information.slug,
            user.id,
            args.message
        );
        io.to(token).emit("chat-assistant:send-message", [
            "assistant",
            message,
            Date.now(),
        ]);
    }
}
