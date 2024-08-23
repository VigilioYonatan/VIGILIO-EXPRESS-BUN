import type { InformationSchema } from "@/information/schemas/information.schema";

export type AuthUserLogin = Pick<InformationSchema, "id">;
export type AuthUser = Omit<InformationSchema, "password">;
