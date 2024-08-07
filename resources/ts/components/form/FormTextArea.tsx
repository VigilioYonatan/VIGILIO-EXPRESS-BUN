import { useContext } from "preact/hooks";
import { FormControlContext } from "./Form";
import type {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import type { HTMLAttributes } from "preact/compat";

interface FormTextAreaLabelProps<T extends object>
    extends Omit<HTMLAttributes<HTMLTextAreaElement>, "type" | "name"> {
    title: string;
    name: keyof T;
    question?: JSX.Element | JSX.Element[];
    options?: RegisterOptions<T, Path<T>>;
}
function FormTextArea<T extends object>({
    name,
    title,
    question,
    options = {},
    ...rest
}: FormTextAreaLabelProps<T>) {
    const {
        register,
        formState: { errors },
        getValues,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

    return (
        <div class="lg:mb-2 w-full">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}
            </label>
            <div class="flex items-center gap-2">
                <textarea
                    className={`${
                        (errors as T)[name] ? "border-red-600" : ""
                    } dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light  shadow-sm  border-gray-200 dark:border-gray-600 border-2 px-2 outline-none rounded-lg py-2.5 my-1 text-sm w-full min-h-[100px] max-h-[100px] lg:min-h-[200px] lg:max-h-[200px]`}
                    id={name as string}
                    {...rest}
                    {...register(name as unknown as Path<T>, options)}
                >
                    {getValues(name as unknown as Path<T>)}
                </textarea>
                {question ? (
                    <div class="relative group">
                        <i class="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div class="text-xs min-w-[200px] max-w-[250px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>
            {(errors as T)[name] ? (
                <p class="text-xs text-red-600">{errors[name]?.message}</p>
            ) : null}
        </div>
    );
}

export default FormTextArea;
