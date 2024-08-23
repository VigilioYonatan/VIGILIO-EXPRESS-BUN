import enviroments from "~/config/enviroments.config";
import type { InformationSchema } from "../schemas/information.schema";
import { prompt } from "@/bot/libs/prompt";

export async function informationSeeder(): Promise<
    Omit<InformationSchema, "id">
> {
    const am8 = "08:00";
    const pm8 = "22:00";

    return {
        name_empresa: "vigilio services",
        email: "vigilioservicesperu@gmail.com",
        telephoneFirst: "968650700",
        about: "this is a a about page",
        enabled: true,
        isOpen: true,
        token: enviroments.VITE_VIGILIO_TOKEN,
        // company: null,
        company: {
            nombreComercial: "VigilioServices",
            ruc: "20706020638",
            razonSocial: "Vigilio Services S.A.C",
            production: false,
            sol_pass: "test",
            sol_user: "test",
            client_id: "client-test",
            client_secret: "client-secret",
            certificado_password: null,
        },
        type_empresa: "normal",
        slug: "vigilioservices",
        address_id: 1,
        certificado: null,
        enabledBot: true,
        facebook: null,
        instagram: null,
        logo: null,
        telephoneReclamos: null,
        telephoneThird: null,
        enabled_igv: true,
        igv: 18,
        credentials: {
            open_ai: "",
            paypal: { PAYPAL_CLIENT_ID: "", PAYPAL_SECRET_KEY: "" },
        },
        inteligenceArtificial: {
            prompt: prompt(),
            datos: [],
            timer: { start: 8, finish: 20 },
            hour_update: 24,
            usage: { input_tokens: 0, output_tokens: 0 },
            nameIa: "Luna",
            enabledBotInteligence: true,
            memory: 9,
        },
        dateRelease: new Date(),
        yearFounded: new Date(2012),
        tiktok: null,
        twitter: null,
        youtube: null,
        contacts: [],
        schedule: [
            {
                id: 1,
                day: "Lunes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 2,
                day: "Martes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 3,
                day: "Miercoles",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 4,
                day: "Jueves",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 5,
                day: "Viernes",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 6,
                day: "Sabado",
                openTime: am8,
                closeTime: pm8,
            },
            {
                id: 0,
                day: "Domingo",
                openTime: am8,
                closeTime: pm8,
            },
        ],
        earning: 30,
        groupWhatsapp: [],
        enabledSendSunat: true,
        enabledSendMessage: true,
        transferencias: null,
        enabledAnimation: true,
        enabledClientPayComision: true,
        whatsappconfig: {
            enabled: "No estamos disponible este momento. Intentelo más tarde.",
            cerrado:
                "Cerrado. No estamos disponible este momento. Intentelo más tarde.",
            thank: "Muchas gracias por su compra, Su {COMPROBANTE} 😊.",
            thank2: "No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
            sendpdf:
                "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
        },
        icon: null,
        map_marker: { lat: -12.053221, lng: -77.044861 },
        enable_map_marker: false,
        payments: {
            ia: { date: new Date(), enabled: true, price: 10, tokens: 1000000 },
            sunat: { date: new Date(), enabled: true, price: 25 },
        },
    };
}
