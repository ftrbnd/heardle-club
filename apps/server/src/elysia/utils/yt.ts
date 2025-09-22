import { Innertube, UniversalCache, Utils, YTNodes } from 'youtubei.js';
import { JSDOM } from 'jsdom';
import BG, { BgConfig } from 'bgutils-js';
import { createWriteStream } from 'fs';

export async function generateClient() {
	let innertube = await Innertube.create({
		retrieve_player: false,
	});

	const requestKey = 'O43z0dpjhgX20SCx4KAo';
	const visitorData = innertube.session.context.client.visitorData;

	if (!visitorData) throw new Error('Could not get visitor data');

	const dom = new JSDOM();

	Object.assign(globalThis, {
		window: dom.window,
		document: dom.window.document,
	});

	const bgConfig: BgConfig = {
		fetch: (input: string | URL | globalThis.Request, init?: RequestInit) =>
			fetch(input, init),
		globalObj: globalThis,
		identifier: visitorData,
		requestKey,
	};

	const bgChallenge = await BG.Challenge.create(bgConfig);

	if (!bgChallenge) throw new Error('Could not get challenge');

	const interpreterJavascript =
		bgChallenge.interpreterJavascript
			.privateDoNotAccessOrElseSafeScriptWrappedValue;

	if (interpreterJavascript) {
		new Function(interpreterJavascript)();
	} else throw new Error('Could not load VM');

	const poTokenResult = await BG.PoToken.generate({
		program: bgChallenge.program,
		globalName: bgChallenge.globalName,
		bgConfig,
	});

	innertube = await Innertube.create({
		po_token: poTokenResult.poToken,
		visitor_data: visitorData,
		cache: new UniversalCache(true),
		generate_session_locally: true,
	});

	return innertube;
}

export async function searchVideo(client: Innertube, query: string) {
	const search = await client.search(query, {
		type: 'video',
	});

	const firstResult = search.videos.first();
	return firstResult.as(YTNodes.Video);
}

export async function downloadAudio(
	client: Innertube,
	videoId: string,
	fileName: string
) {
	const outputPath = `${fileName}.mp3`;

	const stream = await client.download(videoId, {
		client: 'YTMUSIC',
		codec: 'mp4a',
		type: 'audio',
		quality: 'best',
	});

	const writeStream = createWriteStream(outputPath);
	for await (const chunk of Utils.streamToIterable(stream)) {
		writeStream.write(chunk);
	}

	console.log(`Downloaded ${outputPath}`);
	return outputPath;
}
