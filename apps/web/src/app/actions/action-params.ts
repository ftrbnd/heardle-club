import { User } from '@/app/actions/_user';

export type ActionState<UData> = {
	error?: string;
	success?: boolean;
	data?: UData | null;
};

export interface ServerActionParams<
	TParams,
	UData,
	TSessionRequired extends boolean = false,
	TParamsRequired extends boolean = false,
> {
	requiredParams?: TParams;
	sessionRequired?: TSessionRequired;
	validationFn?: (
		user: TSessionRequired extends true ? User : User | null,
		params: TParamsRequired extends true ? TParams : undefined
	) => Promise<ActionState<UData>>;
	actionFn: (
		user: TSessionRequired extends true ? User : User | null,
		params: TParamsRequired extends true ? TParams : undefined,
		data?: UData | null
	) => Promise<{ pathToRevalidate?: string } | void>;
}
