'use client';

import { customToast } from '@/components/layout/toast';
import { useActionState, useEffect } from 'react';

type ActionState = {
	error?: string;
	success?: boolean;
};

interface UseToastActionStateProps {
	action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
	pendingMessage?: string;
	successMessage?: string;
}

export function useToastActionState({
	action,
	pendingMessage,
	successMessage,
}: UseToastActionStateProps) {
	const [state, formAction, actionIsPending] = useActionState(action, {
		error: undefined,
		success: false,
	});

	useEffect(() => {
		if (actionIsPending && pendingMessage) {
			customToast({
				message: pendingMessage,
				type: 'loading',
			});
		} else if (state.error) {
			customToast({
				message: state.error,
				type: 'error',
			});
		} else if (state.success && successMessage) {
			customToast({
				message: successMessage,
				type: 'success',
			});
		}
	}, [state, actionIsPending, pendingMessage, successMessage]);

	return { formAction, actionIsPending, state };
}
