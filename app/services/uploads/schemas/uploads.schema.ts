import {
	type Input,
	number,
	object,
	string,
	custom,
	optional,
} from "@vigilio/valibot";

export function filesSchema(dimensions?: number[]) {
	return object({
		dimension: optional(
			number([
				custom(
					(input) => !!dimensions?.includes(input),
					"Dimension incorrecta",
				),
			]),
		),
		file: string(),
	});
}
export type FilesSchema = Input<ReturnType<typeof filesSchema>>;
