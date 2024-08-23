import { omitAsync, type Input } from "@vigilio/valibot";
import { notesSchema } from "../schemas/notes.schema";

export const notesStoreDto = omitAsync(notesSchema, ["id"]);
export type NotesStoreDto = Input<typeof notesStoreDto>;
