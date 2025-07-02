import { generateState } from 'arctic';
import type { AuthModel } from './model';
import {
	getAuthorizationURL,
	getProviderEndpoint,
	getTokens,
	OAuthProvider,
} from '@/modules/auth/providers.config';
import {
	addOAuthAccount,
	getUserByEmail,
	insertUser,
} from '@repo/database/api';
import {
	createSession,
	inactivityTimeoutSeconds,
} from '@/modules/auth/session';
import { generateSecureRandomString } from '@/utils/random';
import { SelectUser } from '@repo/database/postgres';

export abstract class Auth {
	static async createAuthorizationURL({
		provider,
	}: AuthModel.LoginProviderParams) {
		const state = generateState();
		const url = getAuthorizationURL(provider, state);

		return { state, url };
	}

	static async getProviderUserDetails(provider: OAuthProvider, code: string) {
		const tokens = await getTokens(provider, code, null);

		const providerUserResponse = await fetch(getProviderEndpoint(provider), {
			headers: {
				Authorization: `Bearer ${tokens.accessToken()}`,
			},
		});
		const providerUserDetails = await providerUserResponse.json();
		return providerUserDetails;
	}

	static async getExistingUser(email: string) {
		const existingUser = await getUserByEmail(email);

		return existingUser;
	}

	static async updateExistingUser(
		existingUser: SelectUser,
		provider: OAuthProvider,
		providerUserId: string
	) {
		const session = await createSession(existingUser.id);
		await addOAuthAccount({
			id: generateSecureRandomString(),
			provider,
			providerUserId,
			userId: existingUser.id,
		});

		const expiresAt = new Date(
			session.lastVerifiedAt.getTime() + inactivityTimeoutSeconds * 1000
		);

		return { sessionExpiresAt: expiresAt };
	}

	static async registerNewUser(
		email: string,
		provider: OAuthProvider,
		providerUserId: string
	) {
		const userId = generateSecureRandomString();
		const { user } = await insertUser(
			{
				id: userId,
				email,
			},
			{
				id: generateSecureRandomString(),
				provider,
				providerUserId,
				userId,
			}
		);

		const session = await createSession(user.id);
		const expiresAt = new Date(
			session.lastVerifiedAt.getTime() + inactivityTimeoutSeconds * 1000
		);

		return { sessionExpiresAt: expiresAt };
	}

	static async setUserDetails(
		provider: OAuthProvider,
		existingUser: SelectUser | null,
		providerUserDetails: any
	) {
		const { sessionExpiresAt } = existingUser
			? await Auth.updateExistingUser(
					existingUser,
					provider,
					providerUserDetails.id
				)
			: await Auth.registerNewUser(
					providerUserDetails.email,
					provider,
					providerUserDetails.id
				);

		return { sessionExpiresAt };
	}
}
