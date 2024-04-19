interface AlertWarningProps {
	children: string | JSX.Element | JSX.Element[];
}
function AlertWarning({ children }: AlertWarningProps) {
	return (
		<div
			class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
			role="alert"
		>
			<i class="fa-sharp fa-solid fa-circle-exclamation me-3" />
			{children}
		</div>
	);
}

export default AlertWarning;
