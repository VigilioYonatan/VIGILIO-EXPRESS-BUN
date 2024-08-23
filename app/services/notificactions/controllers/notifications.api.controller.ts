import { Injectable, Post, Req } from "@vigilio/express-core";
import { NotificationsApiService } from "../services/notifications.api.service";
import { Body, Controller, Get, Params, Put } from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { boolean, number, objectAsync, string } from "@vigilio/valibot";
import { Users } from "@/users/entities/users.entity";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import { subscription, type Subscription } from "@/users/schemas/users.schema";

@Injectable()
@Controller("/notifications")
export class NotificationsApiController {
	constructor(
		private readonly notificationsApiService: NotificationsApiService,
	) {}

	@PermissionAuth()
	@Get("/count")
	async count(@Req("user") user: Users) {
		const result = await this.notificationsApiService.count(user);
		return result;
	}

	@PermissionAuth()
	@Validator(subscription)
	@Post("/subscribe")
	async register(@Body() body: Subscription, @Req("user") user: Users) {
		const result = await this.notificationsApiService.register(user, body);
		return result;
	}

	@PermissionAuth()
	@Get("/clean")
	async clean(@Req("user") user: Users) {
		const result = await this.notificationsApiService.clean(user);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Params("id") id: string) {
		const result = await this.notificationsApiService.show(id);
		return result;
	}

	@PermissionAuth()
	@Validator(objectAsync({ notification_id: number(), isRead: boolean() }))
	@Put("/")
	async update(
		@Body()
		body: {
			notification_id: number;
			isRead: boolean;
		},
		@Req("user") user: Users,
	) {
		const result = await this.notificationsApiService.update(user, body);
		return result;
	}
}
