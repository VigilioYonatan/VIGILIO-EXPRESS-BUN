import { Injectable, Req } from "@vigilio/express-core";
import { UsersApiService } from "../services/users.api.service";
import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Put,
    Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { type UsersStoreDto, usersStoreDto } from "../dtos/users.store.dto";
import { type UsersUpdateDto, usersUpdateDto } from "../dtos/users.update.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import {
    usersProfileDto,
    type UsersProfileDto,
} from "../dtos/users.profile.dto";
import type { Users } from "../entities/users.entity";
import {
    type UsersPasswordDto,
    usersPasswordDto,
} from "../dtos/users.password.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/users")
export class UsersApiController {
    constructor(private readonly usersApiService: UsersApiService) {}

    @PermissionAdmin() // solo los admin pueden ver la lista de  usuarios
    @Get("/")
    async index() {
        const result = await this.usersApiService.index();
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(@Params("slug") slug: string) {
        const result = await this.usersApiService.show(slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(usersStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: UsersStoreDto
    ) {
        const result = await this.usersApiService.store(information, body);
        return result;
    }

    @PermissionAuth()
    @Validator(usersProfileDto)
    @Status(200)
    @Put("/profile")
    async profile(@Body() body: UsersProfileDto, @Req("user") user: Users) {
        const result = await this.usersApiService.profile(body, user);
        return result;
    }

    @PermissionAuth()
    @Validator(usersPasswordDto)
    @Status(201)
    @Post("/change-password")
    async changePassword(
        @Body() body: UsersPasswordDto,
        @Req("user") user: Users
    ) {
        const result = await this.usersApiService.changePassword(body, user);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Validator(usersUpdateDto)
    @Status(200)
    @Put("/:id")
    async update(@Params("id") id: string, @Body() body: UsersUpdateDto) {
        const result = await this.usersApiService.update(id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Delete("/:id")
    async destroy(@Params("id") id: string) {
        const result = await this.usersApiService.destroy(id);
        return result;
    }
}
