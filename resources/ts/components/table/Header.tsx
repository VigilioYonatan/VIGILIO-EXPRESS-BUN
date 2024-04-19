import { type JSX } from "preact/jsx-runtime";

interface HeaderProps {
	className?: string;
	children: JSX.Element | JSX.Element[];
}
function Header({
	className = "flex justify-between items-center  gap-3 mb-4",
	children,
}: HeaderProps) {
	return <div className={className}>{children}</div>;
}

export default Header;
