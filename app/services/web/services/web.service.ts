import { Injectable } from "@vigilio/express-core";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
export class WebService {
    async home() {
        return {
            title: "Vigilio Services chat - ia",
            description: "Inteligencia Artificial para whatsapp y whatsapp CRM",
        };
    }

    async orders() {
        return {
            title: "Pedidos",
            description: "Nuestras pedidos.",
        };
    }

    async politica(information: InformationEntity) {
        return {
            title: "Politica y privacidad",
            description: `En ${information.name_empresa}, nos comprometemos a proteger tu privacidad. Recopilamos información personal, de pago y de uso para procesar pedidos, mejorar nuestro servicio y comunicarnos contigo. Protegemos tus datos mediante medidas de seguridad avanzadas. Para más detalles, visita nuestra Política de Privacidad.`,
        };
    }

    async terminos(information: InformationEntity) {
        return {
            title: "Terminos y condiciones",
            description: `Lee los Términos y Condiciones de ${information.name_empresa} para conocer los términos de uso de nuestro sitio web y servicios. Descubre nuestras políticas de compra, envío, devoluciones, y responsabilidades del usuario. Al usar nuestro sitio, aceptas cumplir con estos términos.`,
        };
    }

    async reclamaciones(information: InformationEntity) {
        return {
            title: "Libro de reclamaciones",
            description: `En ${information.name_empresa}, valoramos a nuestros clientes y nos comprometemos a resolver cualquier problema. Consulta nuestra página de Reclamaciones para conocer el proceso de presentación de quejas y cómo gestionamos las reclamaciones. Tu satisfacción es nuestra prioridad.`,
        };
    }
}
