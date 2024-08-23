import { Injectable } from "@vigilio/express-core";
import type { File } from "formidable";
import {
    validateUpload,
    type ValidationProps,
} from "@vigilio/express-core/helpers";
import {
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
} from "@vigilio/express-core";
import {
    removeFile,
    uploadFiles,
    type UploadsEntities,
    type UploadsProperties,
} from "../libs/helpers";
import { productsImagesQualities } from "@/products/libs";
import { informationLogoQualities } from "@/information/libs";
import type { Request } from "express";
import { UsersApiService } from "@/users/services/users.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { usersPhotoQualities } from "@/users/libs";
import { Users } from "@/users/entities/users.entity";
import { InformationEntity } from "@/information/entities/information.entity";
import { ordersTransferenciaImage } from "@/orders/libs";

@Injectable()
export class UploadsService {
    constructor(
        private readonly usersApiService: UsersApiService,
        private readonly productsApiService: ProductsApiService
    ) {}
    async store(props: {
        req: Request;

        entity: UploadsEntities;
        property: UploadsProperties;
    }) {
        const { entity, property } = props;
        const {
            files,
            filesName: name,
            information,
        } = props.req as Request & {
            files: File[];
            filesName: string;
            information: InformationEntity;
        };
        const userAuth = props.req.user as Users | null;

        let qualities = {} as { qualities: number[] | null; directory: string };

        switch (entity) {
            case "users":
                if (property === "photo") {
                    qualities = await this.customUpload(
                        files,
                        { maxFiles: 1, required: false },
                        usersPhotoQualities
                    );
                }
                break;
            case "products":
                if (
                    !userAuth ||
                    !userAuth.enabled ||
                    ![1].includes(userAuth.role_id)
                )
                    throw new UnauthorizedException(
                        "No tiene permiso para realizar esta acción"
                    );
                if (property === "images") {
                    qualities = await this.customUpload(
                        files,
                        {
                            minFiles: 1,
                            maxFiles: 12,
                            required: false,
                        },
                        productsImagesQualities
                    );
                }
                break;

            case "information":
                if (
                    !userAuth ||
                    !userAuth.enabled ||
                    ![1].includes(userAuth.role_id)
                )
                    throw new UnauthorizedException(
                        "No tiene permiso para realizar esta acción"
                    );
                if (property === "logo") {
                    qualities = await this.customUpload(
                        files,
                        {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        },
                        informationLogoQualities
                    );
                }
                if (property === "icon") {
                    qualities = await this.customUpload(
                        files,
                        {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        },
                        [100, 300]
                    );
                }
                if (property === "certificado") {
                    qualities = await this.customUpload(
                        files,
                        {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                            typeFile: {
                                value: [
                                    "application/x-pkcs12",
                                    "application/x-x509-ca-cert",
                                    "application/octet-stream",
                                ],
                            },
                        },
                        null,
                        "/files"
                    );
                }

                break;

            case "orders":
                if (property === "transferencia_image") {
                    qualities = await this.customUpload(
                        files,
                        {
                            minFiles: 1,
                            maxFiles: 1,
                            required: true,
                        },
                        ordersTransferenciaImage
                    );
                }
                break;

            default:
                throw new InternalServerErrorException(
                    "Error server, comunicarse con desarrollador"
                );
        }
        const responseFile = await uploadFiles({
            empresa: information.slug,
            files,
            entity,
            name,
            ...qualities,
        });
        return {
            success: true,
            files: responseFile,
        };
    }
    async update(props: {
        req: Request;
        id: string;
        entity: UploadsEntities;
        property: UploadsProperties;
    }) {
        const { entity, property, id } = props;
        const {
            files,
            filesName: name,
            information,
        } = props.req as Request & {
            files: File[];
            filesName: string;
            information: InformationEntity;
        };
        const userAuth = props.req.user as Users | null;
        let entidad = null;
        switch (entity) {
            case "users": {
                if (
                    !userAuth ||
                    !userAuth.enabled ||
                    userAuth.id !== Number(id)
                )
                    throw new UnauthorizedException(
                        "No tiene permiso para realizar esta acción"
                    );
                const { user } = await this.usersApiService.show(id);
                entidad = user;
                if (user.photo) {
                    removeFile(user.photo);
                }
                break;
            }
            case "products": {
                if (
                    !userAuth ||
                    !userAuth.enabled ||
                    ![1].includes(userAuth.role_id)
                )
                    throw new UnauthorizedException(
                        "No tiene permiso para realizar esta acción"
                    );
                const { product } = await this.productsApiService.show(
                    information,
                    id
                );
                entidad = product;
                if (product.images) {
                    removeFile(product.images);
                }
                break;
            }

            case "information": {
                if (
                    !userAuth ||
                    !userAuth.enabled ||
                    ![1].includes(userAuth.role_id)
                )
                    throw new UnauthorizedException(
                        "No tiene permiso para realizar esta acción"
                    );

                entidad = information;
                if (property === "logo") {
                    if (information.logo) {
                        removeFile(information.logo);
                    }
                }

                if (property === "certificado") {
                    if (information.certificado) {
                        removeFile(information.certificado);
                    }
                }
                if (property === "icon") {
                    if (information.icon) {
                        removeFile(information.icon);
                    }
                }

                break;
            }

            default:
                throw new BadRequestException(
                    "Error server, comunicarse con desarrollador"
                );
        }
        let filesFoto = null;
        if (files) {
            const { files: responseFile } = await this.store({
                req: props.req,
                entity,
                property,
            });
            filesFoto = responseFile;
        }

        /*
        type here is so difficult but  i know that you understand me
        */

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (entidad as any)[property] = filesFoto;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        await (entidad as any).save();
        return {
            success: true,
            files: filesFoto,
        };
    }
    async customUpload(
        files: File[],
        validation: ValidationProps,
        qualities: number[] | null,
        directory = "/images"
    ) {
        try {
            await validateUpload(files, validation);
            return { qualities, directory };
        } catch (error) {
            throw new BadRequestException(error as string);
        }
    }
}
