import { useContext, useEffect } from "preact/hooks";
import { FormControlContext } from "./Form";
import { type JSX } from "preact";
import {
    type FieldErrors,
    type FieldValues,
    type Path,
    type PathValue,
    type RegisterOptions,
    type UseFormReturn,
} from "react-hook-form";
import { useSignal } from "@preact/signals";
import type { HTMLAttributes } from "preact/compat";
import useDropdown from "~/hooks/useDropdown";

interface FormSelectInputProps<T extends object>
    extends Omit<HTMLAttributes<HTMLInputElement>, "name"> {
    title: string;
    name: Path<T>;
    question?: JSX.Element | JSX.Element[] | string;
    ico?: JSX.Element | JSX.Element[];
    options?: RegisterOptions<T, Path<T>>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    array: { value: string; key: any }[];
    placeholder?: string;
    isLoading: boolean;
}
function FormSelectInput<T extends object>({
    name,
    title,
    question,
    ico,
    array,
    options,
    isLoading,
    ...rest
}: FormSelectInputProps<T>) {
    const {
        register,
        formState: { errors },
        setValue,
        getValues,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const dropdown = useDropdown();

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
    const input = useSignal<null | string>(null);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const valueArray = useSignal<{ value: string; key: any }[]>([]);
    const value = getValues(name as Path<T>);

    useEffect(() => {
        if (array.length) {
            if (!input.value || !input.value?.length) {
                valueArray.value = [];
                setValue(name as Path<T>, null as PathValue<T, Path<T>>);
                return;
            }
            valueArray.value = array
                .filter((val) =>
                    new RegExp(input.value!.toLowerCase(), "i").test(
                        val.value.toLowerCase()
                    )
                )
                .slice(0, 8);
            if (!valueArray.value.length) {
                setValue(name as Path<T>, null as PathValue<T, Path<T>>);
            }
        }
    }, [input.value, array]);

    useEffect(() => {
        if (value) {
            const data = array.find((val) => val.key === value) ?? null;
            if (data) {
                input.value = data.value;
                setValue(name as Path<T>, data?.key as PathValue<T, Path<T>>);
            }
        }
    }, [array]);

    return (
        <div class="w-full mb-2 relative">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}
            </label>
            <div class="flex items-center gap-2 relative">
                <div
                    class={`${
                        Object.keys(err).length ? "border border-red-600" : ""
                    } w-full h-[2.5rem] flex items-center gap-2 text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm border border-gray-200 dark:border-gray-600`}
                >
                    {ico ? (
                        <div class="dark:bg-admin-background-dark bg-background-light  shadow min-w-[2.8rem]  h-full flex justify-center items-center">
                            {ico}
                        </div>
                    ) : null}

                    {dropdown.dropdownOpen ? (
                        <div
                            class="absolute p-2 rounded-md shadow dark:bg-admin-terciary top-12 left-0 right-0 z-[10] bg-admin-terciary"
                            ref={dropdown.dropdown}
                        >
                            {valueArray.value.length ? (
                                <>
                                    {valueArray.value.map((val) => (
                                        <button
                                            type="button"
                                            class="w-full py-1.5 hover:bg-admin-paper-dark line-clamp-1"
                                            key={val.key}
                                            onClick={() => {
                                                setValue(
                                                    name as Path<T>,
                                                    val.key
                                                );
                                                input.value = val.value;
                                                dropdown.onClose();
                                            }}
                                        >
                                            {val.value}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <span class="dark:text-white text-xs w-full text-center block py-2">
                                    No se encontró resultados
                                </span>
                            )}
                        </div>
                    ) : null}

                    <input
                        class="outline-none bg-transparent  w-full px-2 sm:text-sm font-normal"
                        id={name as string}
                        {...rest}
                        onChange={(e) => {
                            input.value = (e.target as HTMLInputElement).value;
                            if (dropdown.dropdownOpen) return;
                            dropdown.onOpen();
                        }}
                        value={input.value ?? ""}
                        disabled={isLoading || false}
                    />

                    <input
                        type="hidden"
                        {...register(name as unknown as Path<T>, options)}
                    />
                </div>

                {question ? (
                    <div class="relative group">
                        <i class="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div class="text-xs min-w-[200px] max-w-[250px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>
            <div class={`${isLoading ? "loading-bar" : ""} w-full h-[2px] `} />
            {Object.keys(err).length ? (
                <p class="text-xs text-red-600">{err?.message}</p>
            ) : null}
            <style jsx>{`
                @keyframes loadingAnimation {
                    0% {
                        left: -100%;
                        width: 100%;
                    }
                    50% {
                        left: 0%;
                        width: 10%;
                    }
                    100% {
                        left: 100%;
                        width: 100%;
                    }
                }

                .loading-bar {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .loading-bar::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background-color: currentColor;
                    animation: loadingAnimation 2s infinite;
                }
            `}</style>
        </div>
    );
}

export default FormSelectInput;
