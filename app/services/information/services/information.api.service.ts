import { Injectable } from "@vigilio/express-core";
import { InformationEntity } from "../entities/information.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { InformationUpdateDto } from "../dtos/information.update.dto";
import type { InformationFacturacionUpdateDto } from "../dtos/information.facturacion.store.dto";
import type { InformationIAUpdateDto } from "../dtos/information.ia.update.dto";
import type {
    ContactsSchema,
    GroupWhatsapp,
    ScheduleSchema,
    Whatsappconfig,
} from "../schemas/information.schema";
import type { InformationAddressUpdateDto } from "../dtos/information.address.update.dto";
import { Address } from "../entities/address.entity";

@Injectable()
export class InformationApiService {
    async show(token: string) {
        let information = null;
        if (!Number.isNaN(Number(token))) {
            information = await InformationEntity.findByPk(Number(token), {
                attributes: {
                    exclude: ["emailPassword", "company", "groupWhatsapp"],
                },
            });
        } else {
            information = await InformationEntity.findOne({
                where: {
                    token,
                },
            });
        }

        if (!information) {
            throw new NotFoundException(
                `No se encontró un informacion con ${token}`
            );
        }

        return {
            success: true,
            information,
        };
    }
    async private(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: {
                exclude: ["groupWhatsapp"],
            },
        });

        if (!information) {
            // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            throw new NotFoundException(`No se encontró un informacion`);
        }
        return {
            success: true,
            information,
        };
    }

    async update(
        information: InformationEntity,
        informationUpdateDto: InformationUpdateDto
    ) {
        const data = Object.entries(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            informationUpdateDto.transferencias as any
        ).map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (body) => Object.values((body as any)[1]).filter((val) => val)
        );
        // aca si  esta vacio entonces que sea null
        informationUpdateDto.transferencias =
            data[0].length || data[1].length || data[2].length
                ? informationUpdateDto.transferencias
                : null;

        await information.update(informationUpdateDto);
        return {
            success: true,
            information,
        };
    }
    async whatsappConfigUpdate(slug: string, whatsappconfig: Whatsappconfig) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "whatsappconfig"],
        });
        if (!information) throw new NotFoundException("Error information.");
        await information.update({ whatsappconfig });
        return {
            success: true,
            message: "Se actualizó correctamente los mensajes de whatsapp",
        };
    }
    async company(
        information: InformationEntity,
        companyStoreDto: InformationFacturacionUpdateDto
    ) {
        // to reutilize if company no update certificado
        await information.update({
            company: companyStoreDto,
        });
        return {
            success: true,
            information,
        };
    }
    async inteligenceArtificial(
        slug: string,
        informationIAUpdateDto: InformationIAUpdateDto
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["inteligenceArtificial", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        // to reutilize if company no update certificado
        await information.update({
            inteligenceArtificial: informationIAUpdateDto.inteligenceArtificial,
        });
        return {
            success: true,
            message:
                "Se modificó correctamente el prompt de tu inteligencia Artificial.",
        };
    }
    async all(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        return { success: true, data: information.contacts };
    }
    async favorites(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        // to reutilize if company no update certificado
        const favorites = information.contacts.filter(
            (contact) => contact.isFavorite
        );
        return { success: true, favorites };
    }

    async address(
        information: InformationEntity,
        body: InformationAddressUpdateDto
    ) {
        const address = (await information.$get("address")) as Address;
        await address.update(body);
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }

    async contacts(
        slug: string,
        telephone: string,
        body: { ia: boolean; isFavorite: boolean }
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        if (!information.contacts || !information.contacts.length)
            throw new BadRequestException("No hay contactos");

        const newChanges = information.contacts.map((contacto) => {
            if (contacto.telephone === telephone) {
                return { ...contacto, ...body };
            }
            return contacto;
        });
        await information.update({
            contacts: newChanges,
        });
        return {
            success: true,
            message: "Se realizo correctamente los cambios",
        };
    }
    async searchContact(slug: string, name: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const findByNameContacts = information.contacts
            .filter((contact) =>
                (contact.name ?? "")
                    .toLowerCase()
                    .startsWith(name.toLowerCase())
            )
            .slice(0, 10);
        return {
            success: true,
            data: findByNameContacts,
        };
    }

    async contactStore(slug: string, contactsSchema: ContactsSchema) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const existNumero = information.contacts.find((cont) =>
            cont.telephone.includes(contactsSchema.telephone)
        );
        if (existNumero)
            throw new BadRequestException(
                "Este numero ya existe en tu contacto",
                {
                    body: "telephone",
                }
            );
        await information.update({
            contacts: [
                ...information.contacts,
                {
                    ...contactsSchema,
                    telephone: `51${contactsSchema.telephone}@c.us`,
                },
            ],
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async contactDestroy(slug: string, telephone: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const existNumero = information.contacts.find((cont) =>
            cont.telephone.includes(telephone)
        );
        if (!existNumero)
            throw new BadRequestException("Este numero no existe");
        const filtered = information.contacts.filter(
            (num) => num.telephone !== telephone
        );
        await information.update({
            contacts: filtered,
        });
        return {
            success: true,
            message: "Se agregó nuevo contacto correctamente",
        };
    }
    async scheduleUpdate(
        information: InformationEntity,
        body: { schedule: ScheduleSchema[] }
    ) {
        await information.update({ schedule: body.schedule });
        return {
            success: true,
            message: "Se edito horario de atención correctamente",
        };
    }
    async whatsappGroupIndex(slug: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) return;
        return { success: true, data: information.groupWhatsapp };
    }
    async whatsappGroupShow(slug: string, name: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const group = information.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");
        const getInformation = information.contacts
            .map((contact) =>
                group.members.includes(contact.telephone) ? contact : null
            )
            .filter((contact) => contact);

        return { success: true, group: { ...group, members: getInformation } };
    }
    async whatsappGroupStore(slug: string, body: GroupWhatsapp) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const findGroup = information.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (findGroup)
            throw new BadRequestException(
                `Ya existe grupo con el nombre ${body.name}`,
                { body: "name" }
            );
        const groupWhatsapp = [...(information.groupWhatsapp || []), body];
        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se agregó nuevo grupo whatsapp",
        };
    }

    async whatsappGroupUpdate(slug: string, body: GroupWhatsapp) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const findGroup = information.groupWhatsapp?.find(
            (group) => group.name === body.name
        );
        if (!findGroup)
            throw new BadRequestException(`No existe este grupo ${body.name}`);
        const groupWhatsapp = information.groupWhatsapp.map((group) =>
            group.name === body.name
                ? { name: body.name, members: body.members }
                : group
        );
        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se edito los miembros de whatsapp whatsapp",
        };
    }
    async whatsappGroupDestroy(slug: string, group: string) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["id", "contacts", "groupWhatsapp"],
        });
        if (!information) throw new NotFoundException("Error information.");
        const groupWhatsapp = information!.groupWhatsapp.filter(
            (gro) => gro.name !== group
        );

        await information.update({ groupWhatsapp });
        return {
            success: true,
            message: "Se eliminó grupo de whatsapp correctamente",
        };
    }
    async whatsappGroupTelephoneDestroy(
        slug: string,
        name: string,
        telephone: string
    ) {
        const information = await InformationEntity.findOne({
            where: { slug },
            attributes: ["contacts", "groupWhatsapp", "id", "slug"],
        });
        if (!information) throw new BadRequestException("No informacion");
        const group = information.groupWhatsapp.find(
            (group) => group.name === name
        );
        if (!group) throw new BadRequestException("No se encontró ese grupo");

        const filterGroup = group.members.filter(
            (member) => member !== telephone
        );
        const groupWhatsapp = information.groupWhatsapp.map((group) => {
            if (group.name === name) {
                return { ...group, members: filterGroup };
            }
            return group;
        });

        await information!.update({ groupWhatsapp });
        return {
            success: true,
            message: `Se eliminó telephone del grupo ${name}  correctamente`,
        };
    }
}
