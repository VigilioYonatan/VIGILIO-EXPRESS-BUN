import { object, string, type Input } from "@vigilio/valibot";

export const yapeSchema = object({
	phoneNumber: string(),
	otp: string(),
});
export type YapeSchema = Input<typeof yapeSchema>;
