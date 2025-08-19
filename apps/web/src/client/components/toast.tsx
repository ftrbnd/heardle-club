'use client';

import { Alert, AlertType } from '@/server/components/icons/alert';
import { toast } from 'sonner';

interface ToastProps {
	type: AlertType;
	message: string;
}

export function CustomToast(props: ToastProps) {
	const { type, message } = props;

	return (
		<div className='toast'>
			<div className={`alert ${type === 'loading' ? '' : `alert-${type}`}`}>
				<Alert type={type} />
				<span>{message}</span>
			</div>
		</div>
	);
}

interface PromiseToast<T> {
	promise: Promise<T>;
	loadingText: string;
	successText: string;
	errorText: string;
}

export function customPromiseToast<T>(promise: PromiseToast<T>) {
	return toast.promise(promise.promise, {
		loading: promise.loadingText,
		success: () => promise.successText,
		error: promise.errorText,
	});
}

export function customToast(props: ToastProps) {
	return toast.custom(() => (
		<CustomToast
			type={props.type}
			message={props.message}
		/>
	));
}
