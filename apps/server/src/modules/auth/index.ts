// Controller handle HTTP related eg. routing, request validation
import { AuthModel } from '@/modules/auth/model';
import { Auth } from '@/modules/auth/service';
import { Elysia } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' }).get(
	'/login',
	async ({ body }) => {
		const response = await Auth.createAuthorizationURL(body);

		return response;
	},
	{
		body: AuthModel.createAuthorizationURLBody,
		response: {
			302: AuthModel.redirectToAuthorizationURL,
		},
	}
);
