import WAWebJS, {
    LocalAuth,
    type Message,
    Client,
    MessageMedia,
} from "whatsapp-web.js";
import { promptReplace, transcribeAudio } from ".";
import { delay, randomNumber } from "~/libs/helpers";
import { InformationEntity } from "@/information/entities/information.entity";
import { promptAssitant } from "./prompt";
import { NOW, formatTime, restarDays } from "~/libs/dayjs";
import cron from "node-cron";
import enviroments from "~/config/enviroments.config";
import fs from "node:fs";
import { pathUploads } from "@/uploads/libs/helpers";
import qrcodeTerminal from "qrcode-terminal";
import qrcode from "qrcode";
import openai from "openai";

export function buenosDias(
    query: string,
    name: string,
    information: InformationEntity
) {
    const messages = [
        `¡Hola ${name}! Bienvenido a ${information.name_empresa}, ¿en qué puedo ayudarte hoy? 😊.`,
        `¡Hola ${name}! ¿Cómo puedo ayudarte el día de hoy? 😀.\n `,
    ];
    if (
        [
            "buenos dias",
            "hola",
            "buenas",
            "buenas noches",
            "buenas tardes",
        ].includes(query.toLowerCase())
    ) {
        return messages[randomNumber(0, 1)];
    }
    return null;
}
export function gracias(query: string) {
    const messages = [
        "De nada, estamos aquí para ayudarte 😊.\n",
        "Que bien, estamos aquí para ayudarte 😊.\n .",
    ];
    if (["gracias", "muchas gracias"].includes(query.toLowerCase())) {
        return messages[randomNumber(0, 1)];
    }
    return null;
}

// export async function loadAnthropic() {
// 	const anthropic = await import("@anthropic-ai/sdk");
// 	return new anthropic.Anthropic({
// 		apiKey: enviroments.CLOUDE_TOKEN,
// 	});
// }

// export async function loadMistral() {
// 	const mistral = await import("@mistralai/mistralai");

// 	return new mistral.default(enviroments.MISTRAL_TOKEN);
// }
export let clients: Record<string, WAWebJS.Client> = {};
export let openAis: Record<string, openai> = {};
export async function initializeClients() {
    // Conexión a la base de datos
    const informations = await InformationEntity.findAll();

    // Crear una instancia de Client para cada cuenta en la base de datos
    for (const information of informations) {
        const client = new Client({
            authStrategy: new LocalAuth({ clientId: information.slug }),
        });
        const qrImage = `${pathUploads()}/${information.slug}/qr/${
            information.slug
        }-qr.png`;
        const openAiClient = new openai.OpenAI({
            apiKey: information.credentials.open_ai,
        });

        client.on("qr", (qr) => {
            if (!fs.existsSync(qrImage))
                qrcodeTerminal.generate(qr, { small: true }, () => {
                    qrcode.toFile(qrImage, qr, (err) => {
                        if (err) throw err;
                        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                        console.log("Código QR generado con éxito");
                    });
                });
        });
        clients = { ...clients, [information.slug]: client };
        openAis = { ...openAis, [information.slug]: openAiClient };

        // Opcional: Manejar eventos para cada cliente
        client.on("ready", async () => {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(`Client ${information.name_empresa} is ready!`);
            if (!information.contacts.length) {
                const contacts = await client.getContacts();
                const mappedcontacts = contacts.map((contact) => ({
                    name: contact.name!,
                    telephone: contact.id._serialized,
                    isFavorite: false,
                    ia: true,
                }));
                await information.update({ contacts: mappedcontacts });
            }

            await information?.update({ enabledBot: true });
        });

        client.on("message", (message) => {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(
                `Message received by ${information.name_empresa}:`,
                message.body
            );
        });
        client.on("disconnected", async () => {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log("Cliente se desconectó de whatsapp");
            // eliminar qrcodee
            if (fs.existsSync(qrImage)) {
                fs.unlinkSync(qrImage);
            }
            // enabledBot false
            // const information = await InformationEntity.findByPk(1);
            // if (!information) return;
            await information.update({ enabledBot: false });
            // await this.bot();
        });
        client.initialize();
    }
}

export async function isWhatsappIA(empresa: string, telephone?: string) {
    let clientVigilio = null;
    try {
        clientVigilio = await getClientVigilio();
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Error al hacer fetch a la empresa");
    }
    const [information] = await Promise.all([
        InformationEntity.findOne({
            where: { slug: empresa },
            attributes: {
                exclude: ["certificado", "groupWhatsapp"],
            },
        }),
    ]);
    if (!information) return null;
    const latestInformationUsage = information!.inteligenceArtificial.usage;
    if (!information?.enabledBot) return null;
    const isDateNow = restarDays(NOW().toDate(), information.payments.ia.date!);
    if (!information?.enabledBot) return null;
    if (telephone) {
        const contact = information!.contacts.find(
            (contact) => contact.telephone === telephone
        );
        if (contact && !contact.ia) return null;
        // si existe en el array de contacto y la ia es false que salga null
    }
    if (isDateNow <= 0 && latestInformationUsage.input_tokens <= 0) {
        // actualizamos uso de tokens
        await information.update({
            ...information,
            inteligenceArtificial: {
                ...information.inteligenceArtificial,
                usage: {
                    ...latestInformationUsage,
                    input_tokens: 0,
                    output_tokens: 0,
                },
            },
        });
    }

    return {
        information,
        clientVigilio,
        latestInformationUsage,
    };
}
export async function humanTyping(chat: WAWebJS.Chat, random: number) {
    await delay(random);
    await chat.sendSeen(); // dejar en visto
    await chat.sendStateTyping(); // escribiendo
    await delay(2);
}
export let chats: Record<string, ["assistant" | "user", string][]> = {};
export async function cloudeAiWhatsapp(
    empresa: string,
    client: Client,
    message: Message
) {
    let body = message.body;
    const userId = message.from;
    try {
        const whatsapp = await isWhatsappIA(empresa, userId);
        if (!whatsapp) return;
        const { clientVigilio, information, latestInformationUsage } = whatsapp;

        const chat = await message.getChat();
        if (chat.isGroup) return; //no se admite grupos
        // message.type: chat,sticker,ptt,image,document
        if (!["ptt", "chat"].includes(message.type)) return;

        const random = randomNumber(
            information.inteligenceArtificial.timer.start,
            information.inteligenceArtificial.timer.finish
        );

        // delay en 5 - 15 segundos
        await humanTyping(chat, random);

        //  cuando cierra el restaurante
        const findDay = information.schedule.find(
            (day) => day.id === NOW().day()
        );
        if (
            NOW().isAfter(formatTime(findDay!.openTime)) &&
            NOW().isBefore(formatTime(findDay!.closeTime))
        ) {
        } else {
            return;
        }

        if (message.type === "ptt") {
            const media = await message.downloadMedia();
            const binaryData = Buffer.from(media.data, "base64");
            const audioToTxt = await transcribeAudio(empresa, binaryData);
            body = audioToTxt.text;
        }
        const buenas = buenosDias(
            body,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (message as any)._data.notifyName,
            information
        );
        const thanks = gracias(body);
        if (buenas) {
            await client.sendMessage(message.from, buenas);
            return;
        }
        if (thanks) {
            await client.sendMessage(message.from, thanks);
            return;
        }

        // imporante que esto este acá
        chats[userId] = [...(chats[userId] ?? []), ["user", body]];

        if (chats[userId]) {
            const messages = chats[userId].map(([role, content]) => ({
                role,
                content,
            }));

            // Si el primer mensaje en lastMessages no es del role

            const prompt = await promptReplace(body, information);

            const completion = await openAis[
                information.slug
            ].chat.completions.create({
                model: clientVigilio
                    ? clientVigilio.information.modelai
                    : enviroments.MODEL_AI,
                max_tokens: 300,
                messages: [
                    {
                        role: "user",
                        content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${enviroments.VITE_URL}/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato whatsapp`,
                    },
                    { role: "assistant", content: "Entendido, Empezemos." }, // getting start
                    ...messages.slice(
                        -information.inteligenceArtificial.memory
                    ), // solos los ultimo 7 mensajes
                ],
            });

            // actualizamos uso de tokens
            await information.update({
                ...information,
                inteligenceArtificial: {
                    ...information.inteligenceArtificial,
                    usage: {
                        ...latestInformationUsage,
                        input_tokens:
                            latestInformationUsage.input_tokens +
                            completion.usage!.prompt_tokens,
                        output_tokens:
                            latestInformationUsage.output_tokens +
                            completion.usage!.completion_tokens,
                    },
                },
            });

            // get message ai
            const completionText = completion.choices[0].message.content!;
            let removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
            // quitar las imagenes para enviar imagen
            const baseURL = `${enviroments.VITE_URL}/${empresa}/images/products`;
            const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
            const match = removeNote.match(urlPattern);
            const urlExtraida = match ? match[0] : null;

            if (urlExtraida) {
                removeNote = removeNote.replace(urlPattern, "").trim();
            }

            chats[userId] = [
                ...(chats[userId] || []),
                ["assistant", removeNote],
            ];

            await client.sendMessage(message.from, removeNote);
            // enviar imagen
            if (urlExtraida) {
                await client.sendMessage(
                    message.from,
                    await MessageMedia.fromUrl(urlExtraida),
                    { sendMediaAsSticker: true }
                );
            }
        }
    } catch (error) {
        chats[userId] = [];
    }
}

/**** bot to admin  *****/
export let chatAssistant: Record<
    string,
    ["user" | "assistant", string, number][]
> = {};
export async function cloudeAi(
    empresa: string,
    userId: string,
    message: string
) {
    try {
        const whatsapp = await isWhatsappIA(empresa);
        if (!whatsapp) return;
        const { clientVigilio, information, latestInformationUsage } = whatsapp;

        chatAssistant[userId] = [
            ...(chatAssistant[userId] || []),
            ["user", message, Date.now()],
        ];
        // mapped messages to messages cloude
        const messages = chatAssistant[userId].map(([role, content]) => ({
            role,
            content,
        }));

        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model: clientVigilio
                ? clientVigilio.information.modelai
                : enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: promptAssitant(information!),
                },
                ...messages.slice(
                    -(information.inteligenceArtificial.memory - 1)
                ),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        const removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
        await information!.update({
            ...information!.inteligenceArtificial,
            usage: {
                ...latestInformationUsage,
                input_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestInformationUsage.output_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        chatAssistant[userId] = [
            ...(chatAssistant[userId] || []),
            ["assistant", removeNote, Date.now()],
        ];

        return removeNote;
    } catch (error) {
        return "Hubo un error al usar ia, posible errores no hay tokens.";
    }
}

export async function getClientVigilio() {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/information/client`
    );
    const result: {
        success: true;
        information: { whatsappVersion: string; modelai: string };
    } = await response.json();
    return result;
}
// clean CHAT
// cada 24 horas se limpiara el chat assistant de ambos para consumir menos recursos
cron.schedule("0 0 * * *", () => {
    chatAssistant = {};
    chats = {};
});
