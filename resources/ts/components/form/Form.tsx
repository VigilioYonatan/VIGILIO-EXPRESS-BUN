import { type JSX, createContext } from "preact";
import { type FieldValues, type UseFormReturn } from "react-hook-form";

export const FormControlContext = createContext(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	{} as UseFormReturn<any, unknown, FieldValues>,
);

interface FormProps<T extends object> extends UseFormReturn<T> {
	children: JSX.Element | JSX.Element[] | null;
	onSubmit: (data: T) => void;
	className?: string;
}
function Form<T extends object>({
	children,
	onSubmit,
	className = "",
	...rest
}: FormProps<T>) {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		<FormControlContext.Provider value={rest as any}>
			<form
				noValidate
				onSubmit={rest.handleSubmit(onSubmit)}
				class={`w-full ${className}`}
			>
				{children}
			</form>
		</FormControlContext.Provider>
	);
}

export default Form;
