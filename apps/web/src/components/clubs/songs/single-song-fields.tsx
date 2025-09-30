'use client';

import { useEffect, useState } from 'react';
import { parseBlob, selectCover } from 'music-metadata';
import { SelectBaseSong } from '@repo/database/postgres/schema';
import Image from 'next/image';
import { cn, durationFormatted } from '@/util';

interface SingleSongFields {
	file: File;
}

type SongMetadata = Partial<
	Pick<SelectBaseSong, 'title' | 'artist' | 'album' | 'duration'>
> & {
	picture: string | null;
};

export function SingleSongFields({ file }: SingleSongFields) {
	const [metadata, setMetadata] = useState<SongMetadata | null>(null);
	const [expandImage, setExpandImage] = useState(false);

	useEffect(() => {
		async function getMetadata() {
			const metadata = await parseBlob(file);

			let picture: string | null = null;
			const cover = selectCover(metadata.common.picture);
			if (cover) {
				const base64string = btoa(
					cover.data.reduce(
						(data, byte) => data + String.fromCharCode(byte),
						''
					)
				);
				picture = `data:image/jpeg;base64,${base64string}`;
			}

			setMetadata({
				title: metadata.common.title ?? file.name,
				artist: metadata.common.artists,
				album: metadata.common.album,
				duration: metadata.format.duration,
				picture,
			});
		}

		getMetadata();
	}, [file]);

	return (
		<>
			{metadata?.picture && (
				<Image
					className={cn(
						'rounded-md self-end w-full h-24 object-cover hover:cursor-pointer',
						expandImage && 'h-full'
					)}
					onClick={() => setExpandImage((prev) => !prev)}
					src={metadata.picture}
					alt={metadata?.title ?? 'Album cover'}
					height={100}
					width={100}
				/>
			)}
			{metadata?.duration && (
				<p className='font-mono'>
					{durationFormatted(metadata.duration * 1000)}
				</p>
			)}

			<label className='label'>Title</label>
			<input
				type='text'
				className='input w-full'
				name='title'
				defaultValue={metadata?.title}
			/>

			<label className='label'>Artist</label>
			<input
				type='text'
				className='input w-full'
				name='artist'
				defaultValue={metadata?.artist}
			/>

			<label className='label'>Album</label>
			<input
				type='text'
				className='input w-full'
				name='album'
				defaultValue={metadata?.album ?? ''}
			/>
		</>
	);
}
