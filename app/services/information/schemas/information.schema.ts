import { filesSchema } from "@/uploads/schemas/uploads.schema";
import {
    type Input,
    number,
    minLength,
    array,
    string,
    object,
    startsWith,
    maxLength,
    nullable,
    boolean,
    toTrimmed,
    regex,
    coerce,
    date,
    objectAsync,
    arrayAsync,
    minValue,
    maxValue,
    custom,
} from "@vigilio/valibot";
import { informationLogoQualities } from "../libs";
import type { AddressSchemaEntity } from "./address.schema";

export type Empresa = "normal" | "restaurant" | "servicio";

const payments = object({
    ia: object({
        date: nullable(coerce(date(), (value) => new Date(value as string))),
        price: number("Este campo es obligatorio"),
        tokens: number("Solo numeros"),
        enabled: boolean("Este campo es obligatorio"),
    }),
    sunat: object({
        date: nullable(coerce(date(), (value) => new Date(value as string))),
        price: number("Este campo es obligatorio"),
        enabled: boolean("Este campo es obligatorio"),
    }),
});
export type Payments = Input<typeof payments>;

export const whatsappconfig = objectAsync({
    enabled: string(),
    cerrado: string(),
    thank: string(),
    thank2: string(),
    sendpdf: string(),
});
export type Whatsappconfig = Input<typeof whatsappconfig>;
export const companySchema = objectAsync({
    ruc: string([toTrimmed(), regex(/^(10|20)\d{9}$/, "Ruc no válido")]),
    razonSocial: string([
        toTrimmed(),
        minLength(6, "Este campo permite como mínimo 6 caracteres"),
    ]),
    nombreComercial: string([
        toTrimmed(),
        minLength(6, "Este campo permite como mínimo 6 caracteres"),
    ]),
    sol_user: string([toTrimmed()]),
    sol_pass: string([toTrimmed()]),
    // only guia de remision
    client_id: nullable(string()),
    client_secret: nullable(string()),
    certificado_password: nullable(string()),
    production: boolean(),
});
export const scheduleSchema = objectAsync({
    id: number(),
    day: string([toTrimmed()]),
    openTime: string(),
    closeTime: string(),
});
export const credentials = object({
    paypal: object({
        PAYPAL_CLIENT_ID: string(),
        PAYPAL_SECRET_KEY: string(),
    }),
    open_ai: string(),
});
export type Credentials = Input<typeof credentials>;
export const inteligenceArtificial = object({
    prompt: string(),
    nameIa: string(),
    timer: object({
        start: number(),
        finish: number(),
    }),
    memory: number([
        minValue(3),
        maxValue(21),
        custom((val) => val % 2 !== 0, "Solo debe ser numeros impares."),
    ]),
    datos: array(string()),
    hour_update: number([minValue(6, "Minimo 6")]),
    usage: object({ input_tokens: number(), output_tokens: number() }),
    enabledBotInteligence: boolean(), // usará toda la base de datos. sino filtará los productos que el cliente busca , pero no es muy precioso por que el cliente puede escribir mal
});
export const transferenciaSchema = object({
    bcp: nullable(
        object({
            titular: nullable(string()),
            soles: nullable(string()),
            dolares: nullable(string()),
        })
    ),
    bbva: nullable(
        object({
            titular: nullable(string()),
            soles: nullable(string()),
            dolares: nullable(string()),
        })
    ),
    interbank: nullable(
        object({
            titular: nullable(string()),
            soles: nullable(string()),
            dolares: nullable(string()),
        })
    ),
});

export type TransferenciaSchema = Input<typeof transferenciaSchema>;
export type ScheduleSchema = Input<typeof scheduleSchema>;
export type InteligenceArtificial = Input<typeof inteligenceArtificial>;

export const contactsSchema = objectAsync({
    name: string(),
    telephone: string(),
    isFavorite: boolean(),
    ia: boolean(),
});
export const groupWhatsapp = objectAsync({
    name: string(),
    members: arrayAsync(string()),
});

export type CompanySchema = Input<typeof companySchema>;
export type ContactsSchema = Input<typeof contactsSchema>;
export type GroupWhatsapp = Input<typeof groupWhatsapp>;
export const informationSchema = objectAsync({
    id: number(),
    name_empresa: string(),
    email: string(),
    telephoneFirst: string([minLength(1), minLength(9), maxLength(30)]), //obligatorio
    telephoneReclamos: nullable(string([minLength(9), maxLength(30)])),
    telephoneThird: nullable(string([minLength(9), maxLength(30)])),
    earning: number([minValue(0, "Mínimo 0"), maxValue(100, "Máximo 100")]), //GLOBAL: ganancia de empresa. si producto cuesta 100soles. ganancia 30% ejemplo. 130soles mostrara
    icon: nullable(array(filesSchema([100, 300]))), //obligatorio
    logo: nullable(array(filesSchema(informationLogoQualities))), //obligatorio
    // urls
    facebook: nullable(
        string([
            startsWith(
                "https://www.facebook.com/",
                "Este campo debe empezar con https://www.facebook.com/"
            ),
            maxLength(100),
        ])
    ),
    tiktok: nullable(
        string([
            startsWith(
                "https://www.tiktok.com/",
                "Este campo debe empezar con https://www.tiktok.com/"
            ),
            maxLength(100),
        ])
    ),
    instagram: nullable(
        string([
            startsWith(
                "https://www.instagram.com/",
                "Este campo debe empezar con https://www.instagram.com/"
            ),
            maxLength(100),
        ])
    ),
    twitter: nullable(
        string([
            startsWith(
                "https://www.twitter.com/",
                "Este campo debe empezar con https://www.twitter.com/"
            ),
            maxLength(100),
        ])
    ),
    youtube: nullable(
        string([
            startsWith(
                "https://www.youtube.com/",
                "Este campo debe empezar con https://www.youtube.com/"
            ),
            maxLength(100),
        ])
    ),
    about: string([minLength(1), minLength(20)]), //  acerca de la empresa
    company: companySchema, // informacion de compania para sunat
    certificado: nullable(array(filesSchema())),
    enabled_igv: boolean(), // La tienda  pagará impuestos
    igv: number(),
    isOpen: boolean(), // La tienda esta cerrada
    enabledBot: boolean(), //obligatorio
    enabledSendSunat: boolean(), // cuando el cliente pague por las pasarelas se emitira a sunat
    dateRelease: coerce(date(), (value) => new Date(value as string)), // dia que se creo la web
    inteligenceArtificial, // ia
    enabledSendMessage: boolean(), // si esta activado el cliente  tendrá animaciones
    enabledClientPayComision: boolean(), // si esta activado el cliente de la empresa pagará comision en la pasarelas de pago
    yearFounded: coerce(date(), (value) => new Date(value as string)), // año de fundación de empresa
    contacts: arrayAsync(contactsSchema), // array de contactos
    groupWhatsapp: arrayAsync(groupWhatsapp), // array de grupos de whatsapp
    whatsappconfig, // configuracion whatsapp
    schedule: arrayAsync(scheduleSchema), // horario de trabajo
    address_id: number(), // address
    enabledAnimation: boolean(),
    transferencias: nullable(transferenciaSchema), // array de numero de transferencia si el cliente quiero poner como metodo de pago
    map_marker: object(
        // mapa de la empresa del cliente ?
        { lng: number(), lat: number() },
        "Coordenadas no válida."
    ),
    enable_map_marker: boolean(), // activar google maps. cliente pagará para activar
    // pasarela: string(),
    // auth
    payments,
    slug: string(),
    token: nullable(string()),
    credentials,
    enabled: boolean(), // habilitar web
    type_empresa: string(),
});

export type InformationSchema = Input<typeof informationSchema> & {
    createdAt?: Date;
    updatedAt?: Date;
};
export type InformationEntitySchema = Omit<
    InformationSchema,
    "id" | "createdAt" | "updatedAt"
> & { address: AddressSchemaEntity };
