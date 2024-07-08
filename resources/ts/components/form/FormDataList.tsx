import { useContext } from "preact/hooks";
import { FormControlContext } from "./Form";
import type { JSX } from "preact";
import type {
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import type { HTMLAttributes } from "preact/compat";

interface FormControlLabelProps<T extends object>
    extends Omit<HTMLAttributes<HTMLInputElement>, "type" | "name"> {
    title: string;
    name: keyof T;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    placeholder: string;
    ico?: JSX.Element | JSX.Element[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    array: { value: string; key: any }[];
}
function FormDataList<T extends object>({
    name,
    title,
    question,
    options = {},
    array,
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
                        Object.keys(err).length
                            ? "border border-red-600"
                            : "border border-gray-200 dark:border-gray-600"
                    } w-full h-[2.5rem] flex items-center text-xs rounded-lg   dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm `}
                >
                    {ico ? (
                        <div class="dark:bg-admin-background-dark bg-background-light  shadow min-w-[2.8rem]  h-full flex justify-center items-center">
                            {ico}
                        </div>
                    ) : null}
                    <input
                        class="outline-none bg-transparent  w-full px-2 sm:text-sm font-normal"
                        list="myDatalist"
                        {...rest}
                        id={name as string}
                        {...register(name as unknown as Path<T>, options)}
                    />
                    <datalist class="w-full" id="myDatalist">
                        {array.map(({ value, key }) => (
                            <option
                                selected={
                                    getValues(name as unknown as Path<T>) ===
                                    key
                                }
                                value={key}
                                key={value}
                            >
                                {value}
                            </option>
                        ))}
                    </datalist>
                </div>
                {question ? (
                    <div class="relative group ">
                        <i class="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div class="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white">
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

export default FormDataList;
