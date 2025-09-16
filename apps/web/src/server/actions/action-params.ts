import { User } from '@/app/api/auth/_user';

export type ActionState<UData> = {
	error?: string;
	success?: boolean;
	data?: UData | null;
};

export interface ServerActionParams<
	TParams,
	UData,
	TSessionRequired extends boolean = false,
> {
	requiredParams?: TParams;
	sessionRequired?: TSessionRequired;
	validationFn?: (
		user: TSessionRequired extends true ? User : User | null,
		params?: TParams
	) => Promise<ActionState<UData>>;
	actionFn: (
		user: TSessionRequired extends true ? User : User | null,
		data?: UData | null,
		params?: TParams
	) => Promise<{ pathToRevalidate?: string }>;
}
