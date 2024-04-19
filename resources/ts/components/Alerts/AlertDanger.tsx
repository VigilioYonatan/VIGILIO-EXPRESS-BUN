interface AlertDangerProps {
	children: string | JSX.Element | JSX.Element[];
}
function AlertDanger({ children }: AlertDangerProps) {
	return (
		<div
			class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
			role="alert"
		>
			<i class="fa-sharp fa-solid fa-circle-exclamation me-3" />
			{children}
		</div>
	);
}

export default AlertDanger;
