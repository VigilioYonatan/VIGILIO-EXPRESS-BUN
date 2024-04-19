import { type JSX } from "preact/jsx-runtime";
interface TheadProps {
	className?: string;
	children: JSX.Element | JSX.Element[];
}
function Thead({
	children,
	className = "text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary",
}: TheadProps) {
	return <thead className={className}>{children}</thead>;
}

export default Thead;
