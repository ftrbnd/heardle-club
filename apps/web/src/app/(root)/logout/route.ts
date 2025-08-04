import { logoutUser } from '@/server/actions/auth';
import { loginURL } from '@/lib/domains';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
	await logoutUser();
	revalidateTag('user');

	return redirect(loginURL);
}
