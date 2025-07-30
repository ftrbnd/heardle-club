'use client';

import { Alert, AlertType } from '@/components/icons/alert';
import { toast } from 'sonner';

interface ToastProps {
	type: AlertType;
	message: string;
}

function CustomToast(props: ToastProps) {
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

export function customToast(props: ToastProps) {
	return toast.custom(() => (
		<CustomToast
			type={props.type}
			message={props.message}
		/>
	));
}
