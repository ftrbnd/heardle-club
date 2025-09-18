export function generateSecureRandomString(): string {
	const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789';

	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = '';
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export function sanitizeString(str: string) {
	return str
		.replaceAll('/', '_')
		.replaceAll(' ', '_')
		.replaceAll(/\W/g, '')
		.toLowerCase();
}
