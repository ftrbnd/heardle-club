import { supabase } from '../../supabase';
import { StorageBucket } from './data';

export async function emptyBucket(bucketId: StorageBucket) {
	const { data: bucket } = await supabase.storage.from(bucketId).list();

	if (bucket) {
		for (const folder of bucket) {
			await emptyFolder(bucketId, folder.name);

			if (bucketId === 'club.songs') {
				await emptyFolder(bucketId, `${folder.name}/daily`);
			}
		}
	}
}

async function emptyFolder(bucketId: string, path: string) {
	console.log(`Storage: Emptying folder ${bucketId}/${path}...`);

	const { data } = await supabase.storage.from(bucketId).list(path);
	if (data) {
		const filePaths = data.map((file) => `${path}/${file.name}`);
		await supabase.storage.from(bucketId).remove(filePaths);
	}
}
