import dotenv from "dotenv";
dotenv.config({ path: ".env" });

interface Enviroments {
    NODE_ENV: "production" | "development";
    VITE_URL: string;
    TIPO_EMPRESA: string;
    PORT: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASS: string;
    DB_CONTAINER: string;
    VITE_BG_PRIMARY: string;
    VITE_VIGILIO_WEB: string;
    VITE_VIGILIO_TOKEN: string;
    VITE_VIGILIO_SUNAT: string;
    SECRET_SESSION_KEY: string;
    SECRET_JWT_KEY: string;
    VITE_TOKEN_VIGILIO_SERVICES: string;
    // EMAIL
    ZOHO_CLIENT_ID: string;
    ZOHO_CLIENT_SECRET: string;
    ZOHO_REFRESH_TOKEN: string;
    ZOHO_ACCOUNT_ID: string;
    // NIUBIZ
    NIUBIS_MERCANCY_ID: string;
    NIUBIS_USER: string;
    NIUBIS_PASSWORD: string;
    NIUBIZ_SANDBOX: string;
    VITE_PASARELA_COMISION: number;
    VITE_PASARELA_COMISION_IMPUESTO: number;
    VITE_PASARELA_COMISION_TRANSACCION: number;
    // paypal
    PAYPAL_CLIENT_ID: string;
    PAYPAL_SECRET_KEY: string;
    PAYPAL_SANDBOX: string;
    VITE_PAYPAL_COMISION: number;
    VITE_PAYPAL_TRANSACTION: number;
    // TOKEN AI
    CLOUDE_TOKEN: string;
    OPENAI_TOKEN: string;
    MISTRAL_TOKEN: string;
    // MORE OPTIONS
    VITE_IGV: number;
    MODEL_AI: string;
    WHATSAPPVERSION: string;
    VITE_DIASFACTURASBOLETA: number;
    // NOTIFICATIONS PUSH
    VITE_PLUBIC_VAPID_EMAIL: string;
    VITE_PLUBIC_VAPID_KEY: string;
    VITE_PRIVATE_VAPID_KEY: string;
    // GOOGLE
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    // izipay
    VITE_IZIPAY_URL: string;
    IZIPAY_CLIENT_ID: string;
    IZIPAY_CLIENT_SECRET: string;
    VITE_IZIPAY_PUBLIC_KEY: string;
    IZIPAY_HASH_KEY: string;
    PM2_ID: string;
}
const enviroments: Enviroments = {
    NODE_ENV: process.env.NODE_ENV! as "development" | "production",
    VITE_URL: process.env.VITE_URL!,
    TIPO_EMPRESA: process.env.TIPO_EMPRESA!,
    PORT: process.env.PORT!,
    // db
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT)!,
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASS: process.env.DB_PASS!,
    DB_CONTAINER: process.env.DB_CONTAINER!,
    // color
    VITE_BG_PRIMARY: process.env.VITE_BG_PRIMARY!,
    // VIGILIO
    VITE_VIGILIO_WEB: process.env.VITE_VIGILIO_WEB!,
    VITE_VIGILIO_TOKEN: process.env.VITE_VIGILIO_TOKEN!,
    VITE_VIGILIO_SUNAT: process.env.VITE_VIGILIO_SUNAT!,
    VITE_TOKEN_VIGILIO_SERVICES: process.env.VITE_TOKEN_VIGILIO_SERVICES!,
    // EMAIL
    ZOHO_CLIENT_ID: process.env.ZOHO_CLIENT_ID!,
    ZOHO_CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET!,
    ZOHO_REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN!,
    ZOHO_ACCOUNT_ID: process.env.ZOHO_ACCOUNT_ID!,
    // session
    SECRET_SESSION_KEY: process.env.SECRET_SESSION_KEY!,
    SECRET_JWT_KEY: process.env.SECRET_JWT_KEY!,

    // NIUBIZ
    NIUBIS_MERCANCY_ID: process.env.NIUBIS_MERCANCY_ID!,
    NIUBIS_USER: process.env.NIUBIS_USER!,
    NIUBIS_PASSWORD: process.env.NIUBIS_PASSWORD!,
    NIUBIZ_SANDBOX: process.env.NIUBIZ_SANDBOX!,
    VITE_PASARELA_COMISION: Number(process.env.VITE_PASARELA_COMISION),
    VITE_PASARELA_COMISION_IMPUESTO: Number(
        process.env.VITE_PASARELA_COMISION_IMPUESTO
    ),
    VITE_PASARELA_COMISION_TRANSACCION: Number(
        process.env.VITE_PASARELA_COMISION_TRANSACCION
    ),
    // paypal
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID!,
    PAYPAL_SECRET_KEY: process.env.PAYPAL_SECRET_KEY!,
    PAYPAL_SANDBOX: process.env.PAYPAL_SANDBOX!,
    VITE_PAYPAL_COMISION: Number(process.env.VITE_PAYPAL_COMISION!),
    VITE_PAYPAL_TRANSACTION: Number(process.env.VITE_PAYPAL_TRANSACTION!),
    // AI
    CLOUDE_TOKEN: process.env.CLOUDE_TOKEN!,
    OPENAI_TOKEN: process.env.OPENAI_TOKEN!,
    MISTRAL_TOKEN: process.env.MISTRAL_TOKEN!,
    // GOOGLE
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    // more options
    VITE_IGV: Number(process.env.VITE_IGV!),
    MODEL_AI: process.env.MODEL_AI!,
    WHATSAPPVERSION: process.env.WHATSAPPVERSION!,
    VITE_DIASFACTURASBOLETA: Number(process.env.VITE_DIASFACTURASBOLETA)!,
    // notifications push
    VITE_PLUBIC_VAPID_EMAIL: process.env.VITE_PLUBIC_VAPID_KEY!,
    VITE_PLUBIC_VAPID_KEY: process.env.VITE_PLUBIC_VAPID_KEY!,
    VITE_PRIVATE_VAPID_KEY: process.env.VITE_PRIVATE_VAPID_KEY!,
    // izipay
    VITE_IZIPAY_URL: process.env.VITE_IZIPAY_URL!,
    IZIPAY_CLIENT_ID: process.env.IZIPAY_CLIENT_ID!,
    VITE_IZIPAY_PUBLIC_KEY: process.env.VITE_IZIPAY_PUBLIC_KEY!,
    IZIPAY_CLIENT_SECRET: process.env.IZIPAY_CLIENT_SECRET!,
    IZIPAY_HASH_KEY: process.env.IZIPAY_HASH_KEY!,
    PM2_ID: process.env.PM2_ID!,
};

export default enviroments;
