import { InformationApiService } from "../services/information.api.service";
import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Put,
    Status,
    Information,
    Injectable,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { arrayAsync, objectAsync, omitAsync, string } from "@vigilio/valibot";
import {
    type InformationUpdateDto,
    informationUpdateDto,
} from "../dtos/information.update.dto";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    informationFacturacionUpdateDto,
    type InformationFacturacionUpdateDto,
} from "../dtos/information.facturacion.store.dto";
import {
    informationIAUpdateDto,
    type InformationIAUpdateDto,
} from "../dtos/information.ia.update.dto";

import {
    contactsSchema,
    groupWhatsapp,
    scheduleSchema,
    whatsappconfig,
    type ContactsSchema,
    type GroupWhatsapp,
    type ScheduleSchema,
    type Whatsappconfig,
} from "../schemas/information.schema";
import {
    informationAddressUpdateDto,
    type InformationAddressUpdateDto,
} from "../dtos/information.address.update.dto";
import { InformationEntity } from "../entities/information.entity";

@Injectable()
@Controller("/information")
export class InformationApiController {
    constructor(
        private readonly informationApiService: InformationApiService
    ) {}

    @PermissionAdmin()
    @Get("/private")
    async private(@Req("information") information: InformationEntity) {
        const result = await this.informationApiService.private(
            information.slug
        );
        return result;
    }
    @PermissionAdmin()
    @Get("/group-whatsapp")
    async whatsappGroupIndex(
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappGroupIndex(
            information.slug
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            name: string(),
        })
    )
    @Get("/group-whatsapp/:name")
    async whatsappGroupShow(
        @Params("name") name: string,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappGroupShow(
            information.slug,
            name
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(groupWhatsapp)
    @Status(201)
    @Post("/group-whatsapp")
    async whatsappGroupStore(
        @Body() body: GroupWhatsapp,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappGroupStore(
            information.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(whatsappconfig)
    @Status(201)
    @Put("/whatsapp-config")
    async whatsappConfigUpdate(
        @Body() body: Whatsappconfig,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappConfigUpdate(
            information.slug,
            body
        );
        return result;
    }
    @PermissionAdmin()
    @Validator(groupWhatsapp)
    @Status(201)
    @Put("/group-whatsapp")
    async whatsappGroupUpdate(
        @Body() body: GroupWhatsapp,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappGroupUpdate(
            information.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            group: string(),
        })
    )
    @Status(201)
    @Delete("/group-whatsapp/:group")
    async whatsappGroupDestroy(
        @Params("group") group: string,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.whatsappGroupDestroy(
            information.slug,
            group
        );
        return result;
    }
    @PermissionAdmin()
    @Pipe(
        objectAsync({
            telephone: string(),
            group: string(),
        })
    )
    @Status(201)
    @Delete("/group-whatsapp/:group/telephone/:telephone")
    async whatsappGroupTelephoneDestroy(
        @Params("group") group: string,
        @Req("information") information: InformationEntity,
        @Params("telephone") telephone: string
    ) {
        const result =
            await this.informationApiService.whatsappGroupTelephoneDestroy(
                information.slug,
                group,
                telephone
            );
        return result;
    }

    @Pipe(
        objectAsync({
            slug: string(),
        })
    )
    @Get("/:slug")
    async show(@Params("slug") slug: string) {
        const result = await this.informationApiService.show(slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(informationUpdateDto)
    @Status(201)
    @Put("/")
    async update(
        @Body() body: InformationUpdateDto,
        @Information() information: InformationEntity
    ) {
        const result = await this.informationApiService.update(
            information,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(informationAddressUpdateDto)
    @Status(201)
    @Put("/address")
    async address(
        @Body() body: InformationAddressUpdateDto,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.address(
            information,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(informationFacturacionUpdateDto)
    @Status(201)
    @Put("/company")
    async company(
        @Body() body: InformationFacturacionUpdateDto,
        @Information() information: InformationEntity
    ) {
        const result = await this.informationApiService.company(
            information,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(informationIAUpdateDto)
    @Status(201)
    @Put("/ia")
    async inteligenceArtificial(
        @Body() body: InformationIAUpdateDto,
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.inteligenceArtificial(
            information.slug,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Status(200)
    @Get("/contacts")
    async all(@Req("information") information: InformationEntity) {
        const result = await this.informationApiService.all(information.slug);
        return result;
    }

    @PermissionAdmin()
    @Validator(contactsSchema)
    @Status(201)
    @Post("/contacts")
    async contactstore(
        @Req("information") information: InformationEntity,
        @Body() body: ContactsSchema
    ) {
        const result = await this.informationApiService.contactStore(
            information.slug,
            body
        );
        return result;
    }

    @Status(200)
    @Get("/contacts/favorites")
    async favorites(@Req("information") information: InformationEntity) {
        const result = await this.informationApiService.favorites(
            information.slug
        );
        return result;
    }

    @Validator(omitAsync(contactsSchema, ["telephone", "name"]))
    @Pipe(
        objectAsync({
            telephone: string(),
        })
    )
    @Status(201)
    @Put("/contacts/:telephone")
    async contacts(
        @Req("information") information: InformationEntity,
        @Params("telephone") telephone: string,
        @Body() body: { ia: boolean; isFavorite: boolean }
    ) {
        const result = await this.informationApiService.contacts(
            information.slug,
            telephone,
            body
        );
        return result;
    }

    @Pipe(
        objectAsync({
            name: string(),
        })
    )
    @Get("/contacts/:name")
    async searchContact(
        @Req("information") information: InformationEntity,
        @Params("name") name: string
    ) {
        const result = await this.informationApiService.searchContact(
            information.slug,
            name
        );
        return result;
    }

    @Pipe(
        objectAsync({
            telephone: string(),
        })
    )
    @Status(201)
    @Delete("/contacts/:telephone")
    async destroyContact(
        @Req("information") information: InformationEntity,
        @Params("telephone") telephone: string
    ) {
        const result = await this.informationApiService.contactDestroy(
            information.slug,
            telephone
        );
        return result;
    }

    @Status(201)
    @Validator(objectAsync({ schedule: arrayAsync(scheduleSchema) }))
    @Put("/schedule")
    async scheduleUpdate(
        @Body() body: { schedule: ScheduleSchema[] },
        @Req("information") information: InformationEntity
    ) {
        const result = await this.informationApiService.scheduleUpdate(
            information,
            body
        );
        return result;
    }
}
