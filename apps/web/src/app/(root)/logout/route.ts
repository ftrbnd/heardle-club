import { logoutUser } from '@/app/actions/auth';
import { loginURL } from '@/util/domains';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
	await logoutUser();
	revalidateTag('user');

	return redirect(loginURL);
}
