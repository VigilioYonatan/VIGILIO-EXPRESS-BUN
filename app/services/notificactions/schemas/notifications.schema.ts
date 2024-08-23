import { number, objectAsync, string, type Input } from "@vigilio/valibot";

export const notificationsSchema = objectAsync({
    id: number(),
    type: string(),
    url: string(),
    content: string(),
    information_id: number(),
});

export type NotificationsSchema = Input<typeof notificationsSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type NotifcationType = "register" | "order";
