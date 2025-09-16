/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@/app/api/auth/server.services';
import {
	ActionState,
	ServerActionParams,
} from '@/server/actions/action-params';
import { revalidatePath } from 'next/cache';

export const defaultState = {
	error: undefined,
	success: false,
	data: null,
} as const;

function validateParams<TParams extends Record<string, any>>(
	obj: TParams
): ActionState<TParams> {
	for (const key of Object.keys(obj)) {
		const value = obj[key];

		if (value === undefined || value === null)
			return { error: `${key} is required.` };
		if (typeof value === 'string' && value === '')
			return { error: `${key} is required.` };
	}

	return { success: true };
}

export async function createServerAction<TParams, UData>(
	params: ServerActionParams<TParams, UData, true, true>
): Promise<ActionState<UData>>;
export async function createServerAction<TParams, UData>(
	params: ServerActionParams<TParams, UData, true, false>
): Promise<ActionState<UData>>;
export async function createServerAction<TParams, UData>(
	params: ServerActionParams<TParams, UData, false, false>
): Promise<ActionState<UData>>;
export async function createServerAction<TParams, UData>(
	params: ServerActionParams<TParams, UData, false, true>
): Promise<ActionState<UData>>;
export async function createServerAction<
	TParams,
	UData,
	TSessionRequired extends boolean,
	TParamsRequired extends boolean,
>({
	requiredParams,
	sessionRequired,
	validationFn,
	actionFn,
}: ServerActionParams<
	TParams,
	UData,
	TSessionRequired,
	TParamsRequired
>): Promise<ActionState<UData>> {
	const user = sessionRequired ? await getCurrentUser() : null;
	if (sessionRequired && !user) return { error: 'Unauthorized' };

	// validate requiredParams
	const { error: paramsError } = requiredParams
		? validateParams(requiredParams)
		: defaultState;
	if (paramsError) return { error: paramsError };

	// additional validation (formData, etc.)
	const { error: validationError, data } = validationFn
		? await validationFn(user as any, requiredParams as any)
		: defaultState;
	if (validationError) return { error: validationError };

	try {
		const { pathToRevalidate } = await actionFn(
			user as any,
			requiredParams as any,
			data
		);

		if (pathToRevalidate) revalidatePath(pathToRevalidate);

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error)
			return {
				error: error.message,
			};
	}

	return {
		error: 'Something went wrong.',
	};
}
