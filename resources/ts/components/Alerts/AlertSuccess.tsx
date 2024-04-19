interface AlertSuccessProps {
	children: string | JSX.Element | JSX.Element[];
}
function AlertSuccess({ children }: AlertSuccessProps) {
	return (
		<div
			class="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
			role="alert"
		>
			<i class="fa-sharp fa-solid fa-circle-exclamation me-3" />
			{children}
		</div>
	);
}

export default AlertSuccess;
