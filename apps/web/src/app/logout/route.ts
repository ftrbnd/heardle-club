import { logoutUser } from '@/actions/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET() {
	await logoutUser();
	revalidateTag('user');

	return redirect('/login');
}
