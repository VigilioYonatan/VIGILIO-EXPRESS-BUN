/*
Configuración: No tocar. si tienes problema comunicarte en esta parte con vigilio
*/
import { type FunctionComponent, render as renderPreact } from "preact";
import { Suspense } from "preact/compat";
import { c } from "@vigilio/sweet";

function Provider(
	el: Element,
	children: JSX.Element | JSX.Element[],
	fallback: null | JSX.Element | JSX.Element[] = null,
) {
	return renderPreact(<Suspense fallback={fallback}>{children}</Suspense>, el);
}

function render(
	element: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	Component: FunctionComponent<any>,
	fallback: null | JSX.Element | JSX.Element[] = null,
) {
	const elements = document.querySelectorAll(nameTemplate(element));
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let props: any = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	elements.forEach((el) => {
		if (el) {
			for (const [_key, value] of Object.entries(el?.attributes)) {
				const printValue: string = value.name.startsWith(":")
					? JSON.parse(value.value)
					: value.value;
				const printName: string = value.name.startsWith(":")
					? value.name.slice(1)
					: value.name;
				props = { ...props, [printName]: printValue };
			}
			Provider(el, <Component {...props} />, fallback);
		}
	});
}
function nameTemplate(text: string) {
	return text.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function reactComponent(
	children: JSX.Element | JSX.Element[],
	fallback: null | JSX.Element | JSX.Element[] = null,
) {
	const div = c("div", { className: "w-full text-start" });
	Provider(div, children, fallback);
	return div as HTMLElement;
}

export default render;
