import { omitAsync, type Input } from "@vigilio/valibot";
import { notesSchema } from "../schemas/notes.schema";

export const notesUpdateDto = omitAsync(notesSchema, ["id"]);
export type NotesUpdateDto = Input<typeof notesUpdateDto>;
