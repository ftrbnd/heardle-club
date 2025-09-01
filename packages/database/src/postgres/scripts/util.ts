import { supabase } from '../../supabase';

export async function emptyBucket(bucketId: string) {
	const { data: bucket } = await supabase.storage.from(bucketId).list();

	if (bucket) {
		for (const folder of bucket) {
			const { data: folderFiles } = await supabase.storage
				.from(bucketId)
				.list(folder.name);
			if (folderFiles) {
				const filePaths = folderFiles.map(
					(file) => `${folder.name}/${file.name}`
				);
				await supabase.storage.from(bucketId).remove(filePaths);
			}
		}
	}
}
