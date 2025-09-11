/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from 'next/cache';

export type ActionState<UData> = {
	error?: string;
	success?: boolean;
	data?: UData | null;
};

interface ServerActionParams<TParams, UData> {
	requiredParams?: TParams;
	validationFn?: (params?: TParams) => Promise<ActionState<UData>>;
	actionFn: (
		data?: UData | null,
		params?: TParams
	) => Promise<{ pathToRevalidate?: string }>;
}

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
			return {
				error: `${key} is required.`,
			};
	}

	return { success: true };
}

export async function createServerAction<TParams, UData>({
	requiredParams,
	validationFn,
	actionFn,
}: ServerActionParams<TParams, UData>): Promise<ActionState<UData>> {
	// validate requiredParams
	const { error: paramsError } = requiredParams
		? validateParams(requiredParams)
		: defaultState;
	if (paramsError) return { error: paramsError };

	// additional validation (formData, etc.)
	const { error: validationError, data } = validationFn
		? await validationFn(requiredParams)
		: defaultState;
	if (validationError) return { error: validationError };

	try {
		const { pathToRevalidate } = await actionFn(data, requiredParams);

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
