import authFormControl from "./AuthFormControl";
import VigilioForm from "./Form";
import FormButtonReset from "./FormButtonReset";
import FormButtonSubmit from "./FormButtonSubmit";
import FormControl from "./FormControl";
import FormFile from "./FormFile";
import FormRadio from "./FormToggle";
import FormSelect from "./FormSelect";
import FormTextArea from "./FormTextArea";
import WebFormControl from "./WebFormControl";
import WebFormTextArea from "./WebFormTextArea";
import WebFormSelect from "./WebFormSelect";
import type{ FieldErrors } from "react-hook-form";

export function anidarPropiedades<T extends object>(
    obj: FieldErrors<T>,
    keysArray: string[]
) {
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

const Form = Object.assign(VigilioForm, {
    control: Object.assign(FormControl, {
        file: FormFile,
        select: FormSelect,
        area: FormTextArea,
        web: Object.assign(WebFormControl, {
            area: WebFormTextArea,
            select: WebFormSelect,
        }),
        auth: authFormControl,
        toggle: FormRadio,
    }),
    button: { reset: FormButtonReset, submit: FormButtonSubmit },
});
export default Form;
