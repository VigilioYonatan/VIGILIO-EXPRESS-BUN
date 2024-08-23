import { boolean, number, objectAsync, type Input } from "@vigilio/valibot";

export const notificationsUserSchema = objectAsync({
    user_id: number(),
    notification_id: number(),
    isRead: boolean(),
    information_id: number(),
});

export type NotificationsUserSchema = Input<typeof notificationsUserSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
