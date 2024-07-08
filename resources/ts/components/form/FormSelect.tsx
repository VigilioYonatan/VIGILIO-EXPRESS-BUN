import { useContext } from "preact/hooks";
import { FormControlContext } from "./Form";
import { type JSX } from "preact";
import {
    type FieldErrors,
    type FieldValues,
    type Path,
    type RegisterOptions,
    type UseFormReturn,
} from "react-hook-form";
import { type HTMLAttributes } from "preact/compat";

interface FormControlLabelProps<T extends object>
    extends Omit<HTMLAttributes<HTMLSelectElement>, "type" | "name"> {
    title: string;
    name: keyof T;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    placeholder: string;
    ico?: JSX.Element | JSX.Element[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    array: { value: string; key: any }[];
}
function FormSelect<T extends object>({
    name,
    title,
    question,
    options = {},
    array,
    placeholder,
    ico,
    ...rest
}: FormControlLabelProps<T>) {
    const {
        register,
        getValues,
        formState: { errors },
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    function anidarPropiedades(obj: FieldErrors<T>, keysArray: string[]) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let currentObj: any = obj;
        for (let i = 0; i < keysArray.length; i++) {
            const key = keysArray[i];
            // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
            if (!currentObj.hasOwnProperty(key)) {
                currentObj[key] = {}; // Crear un objeto vacío si la propiedad no existe
            }
            currentObj = currentObj[key]; // Moverse al siguiente nivel del objeto
        }
        return currentObj;
    }
    const err = anidarPropiedades(errors, (name as string).split("."));

    return (
        <div class="lg:mb-2 w-full mb-2">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}
            </label>
            <div class="flex items-center gap-2">
                <div
                    class={`${
                        Object.keys(err).length ? "border border-red-600" : ""
                    } w-full h-[2.5rem] flex items-center text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm border border-gray-200 dark:border-gray-600`}
                >
                    {ico ? (
                        <div class="dark:bg-admin-background-dark bg-background-light  shadow min-w-[2.8rem]  h-full flex justify-center items-center">
                            {ico}
                        </div>
                    ) : null}
                    <select
                        id={name as string}
                        class={`${
                            (errors as T)[name] ? "border-red-600" : ""
                        }  bg-transparent font-normal my-1 text-sm w-full outline-none shadow-sm`}
                        {...rest}
                        {...register(name as unknown as Path<T>, options)}
                    >
                        <option
                            class="text-black"
                            selected={
                                Number.isNaN(
                                    getValues(name as unknown as Path<T>)
                                ) ||
                                getValues(name as unknown as Path<T>) === null
                            }
                            value=""
                        >
                            {placeholder}
                        </option>
                        {array.map(({ value, key }) => (
                            <option
                                selected={
                                    getValues(name as unknown as Path<T>) ===
                                    key
                                }
                                class="text-black"
                                value={key}
                                key={key}
                            >
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                {question ? (
                    <div class="relative group ">
                        <i class="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div class="text-[9px] min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>
            {Object.keys(err).length ? (
                <p class="text-xs text-red-600">{err?.message}</p>
            ) : null}
        </div>
    );
}

export default FormSelect;
export function formSelectNumber(value: string) {
	return Number(value) > 0 ? Number(value) : null;
}
