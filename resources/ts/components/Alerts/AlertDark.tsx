interface AlertDarkProps {
	children: string | JSX.Element | JSX.Element[];
}
function AlertDark({ children }: AlertDarkProps) {
	return (
		<div
			class="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
			role="alert"
		>
			<i class="fa-sharp fa-solid fa-circle-exclamation me-3" />
			{children}
		</div>
	);
}

export default AlertDark;
