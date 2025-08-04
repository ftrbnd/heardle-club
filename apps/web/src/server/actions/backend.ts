'use server';

export async function submitClubSongs(formData: FormData) {
	const rawFormData = Object.fromEntries(formData);
	console.log(rawFormData);
	const trackIds = formData.get('track');
	console.log({ trackIds });
}
