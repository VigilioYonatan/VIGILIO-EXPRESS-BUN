import type { InformationEntity } from "@/information/entities/information.entity";
import type { Users } from "@/users/entities/users.entity";
import type { Request } from "express";

export type RequestVigilio = Request & {
    information: InformationEntity | null;
    user: Users;
};
