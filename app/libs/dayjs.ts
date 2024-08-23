import dayjs, { type OpUnitType, type QUnitType } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);
// que sea de  ahora. hora peruana
export function NOW() {
    return dayjs().tz("America/Lima").utc(true);
}

export function TimePeru(date: Date | string | number | dayjs.Dayjs) {
    return dayjs(date).tz("America/Lima").utc(true);
}
export function restarDays(
    now: Date | string | number | dayjs.Dayjs,
    back: Date | string | number | dayjs.Dayjs,
    time: QUnitType | OpUnitType = "minute"
) {
    return dayjs(back).diff(now, time);
}
export function formatDateTwo(
    date: string | Date | number,
    format = "DD-MM-YYYY hh:mm A"
): string | Date {
    return dayjs(date).tz("America/Lima").utc(true).format(format);
} // verificar si esta dentro de esa fecha. pones la fecha
export function isDateWithin(
    date: Date | string,
    timer: number,
    time: dayjs.ManipulateType = "days"
) {
    const today = dayjs(date);
    const twoWeeksFromNow = today.add(timer, time);

    return NOW().isAfter(twoWeeksFromNow);
}

export function getTime() {
    const day = dayjs().tz("America/Lima").utc(true);
    const currentYear = day.year();
    const currentMonth = day.month() + 1;
    const startOfYear = day.startOf("year").add(5, "hour").toDate();
    const endOfYear = day.endOf("year").add(5, "hour").toDate();
    const startOfToday = day.startOf("day").add(5, "hour").toDate();
    const endOfToday = day.endOf("day").add(5, "hour").toDate();
    const startOfWeek = day.startOf("week").add(5, "hour").toDate();
    const endOfWeek = day.endOf("week").add(5, "hour").toDate();
    const startOfMonth = day.startOf("month").add(5, "hour").toDate();
    const endOfMonth = day.endOf("month").add(5, "hour").toDate();
    const startOfYesterday = day
        .subtract(1, "day")
        .startOf("day")
        .add(5, "hour")
        .toDate();
    const endOfYesterday = day
        .subtract(1, "day")
        .endOf("day")
        .add(5, "hour")
        .toDate();

    return {
        currentYear,
        currentMonth,
        startOfYear,
        endOfYear,
        startOfToday,
        endOfToday,
        startOfWeek,
        endOfWeek,
        startOfMonth,
        endOfMonth,
        startOfYesterday,
        endOfYesterday,
    };
}
/* time : 08:00  */
export function formatTime(time: string) {
    const partesHora = time.split(":");
    const horas = Number.parseInt(partesHora[0], 10); // Convertir la parte de las horas a un número entero
    const minutos = Number.parseInt(partesHora[1], 10);
    const fecha = NOW().hour(horas).minute(minutos);
    return fecha;
}
export default dayjs;
