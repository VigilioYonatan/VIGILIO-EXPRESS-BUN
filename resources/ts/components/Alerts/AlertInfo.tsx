interface AlertDangerProps {
	children: string | JSX.Element | JSX.Element[];
}
function AlertInfo({ children }: AlertDangerProps) {
	return (
		<div
			class="flex items-center p-4 mb-4 text-sm text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800"
			role="alert"
		>
			<i class="fa-sharp fa-solid fa-circle-exclamation me-3" />
			{children}
		</div>
	);
}

export default AlertInfo;
