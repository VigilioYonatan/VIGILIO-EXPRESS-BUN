import { objectAsync, string, unknown, type Input } from "@vigilio/valibot";
export const notificationsPushDto = objectAsync({
	title: string(),
	message: string(),
	subscription: unknown(),
});
export type NotificationsPushDto = Input<typeof notificationsPushDto>;
