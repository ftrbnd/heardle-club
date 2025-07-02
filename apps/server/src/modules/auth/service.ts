import { generateState } from 'arctic';
import type { AuthModel } from './model';
import { getAuthorizationURL } from '@/modules/auth/providers.config';

export abstract class Auth {
	static async createAuthorizationURL({
		provider,
	}: AuthModel.LoginProviderParams) {
		const state = generateState();
		const url = getAuthorizationURL(provider, state);

		return { state, url };
	}
}
