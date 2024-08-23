/* PRO-00001 */
export async function generateCodeEntity(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    Item: any,
    latestCode: string,
    start: string
) {
    const latestUser = await Item.findOne({
        order: [["createdAt", "DESC"]],
    });
    let code = null;

    if (latestUser) {
        const ultimoNumero = Number.parseInt(
            latestUser[latestCode].split("-")[1]
        );
        code = `${start.toUpperCase()}-${String(ultimoNumero + 1).padStart(
            6,
            "0"
        )}`;
    } else {
        code = `${start.toUpperCase()}-000001`;
    }
    return code;
}
/* get ip */
export async function getIp() {
    const ipResponse = await fetch("https://api.ipify.org");
    const ipResult = await ipResponse.text();
    return ipResult;
}

/* delay */
export async function delay(seg = 10) {
    return new Promise((res) => setTimeout(() => res(true), seg * 1000));
}

/*** random number between*/
export function randomNumber(start: number, end: number) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function removeTextHTML(value: string) {
    return value.replace(/(<([^>]+)>)/gi, "");
}

/* dolar */
export type Money = "DOLARES" | "SOLES";

export const MONEYSOLES: Money = "SOLES";
export const MONEYDOLARES: Money = "DOLARES";

export function distanciaDeLevenshtein(a: string, b: string) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    // Llenamos la matriz
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // sustitución
                    matrix[i][j - 1] + 1, // inserción
                    matrix[i - 1][j] + 1 // eliminación
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
// nos trae 0,5,10 depende de cuantos numeros hay
export function createIncrementArray(numbers: number[]): number[] {
    const resultado = new Set<number>(); // Usamos Set para evitar duplicados
    for (const num of numbers) {
        const multiploMasCercano = Math.floor(num / 5) * 5;
        resultado.add(multiploMasCercano);
    }
    return Array.from(resultado).sort((a, b) => a - b);
}
