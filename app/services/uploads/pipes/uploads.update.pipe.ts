import { custom, objectAsync, string } from "@vigilio/valibot";
import {
	type UploadsEntities,
	type UploadsProperties,
	uploadsEntities,
	uploadsProperties,
} from "../libs/helpers";

export const uploadsUpdatePipe = objectAsync({
	entity: string("Este campo es obligatorio", [
		custom((input) => uploadsEntities.includes(input as UploadsEntities)),
	]),
	id: string("Este campo es obligatorio"),
	property: string("Este campo es obligatorio", [
		custom((input) => uploadsProperties.includes(input as UploadsProperties)),
	]),
});
