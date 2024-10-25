const pendingReciever = {};
const compressor = new CompressionStream("deflate");
const imgEncoderOSC = new OffscreenCanvas(0, 0);
const imgEncoderCtx = imgEncoderOSC.getContext("2d");
const imgEncoderZeroSize = { width: 0, height: 0 }

const rtcSendStream = async (channel, readable) => {
	const streamReader = readable.getReader();
	const hashes = [];
	while(true) {
		const { value, done } = await streamReader.read();
		if(done) break;
		hashes.push({ value, hash: await crypto.subtle.digest("SHA-256", value) });
	}
	channel.send(new ArrayBuffer(...hashes.map(({ hash }) => {

	})))
	Object.keys(hashes).forEach(({ value }) => channel.send(value))
}

addEventListener("fetch", async (fetchEvent) => {
	const { request: fetchReq } = fetchEvent;

	switch(fetchReq.method) {

		case "POST": {

			if(new URL(fetchReq.url).pathname !== "/share-from-target") return;

			fetchEvent.respondWith((async () => {	
				const
					cacheKeys = await caches.keys(),
					fileData = fetchReq.formData().get("file-data"),
					fileCache = await caches.open(cacheKeys.filter((key) => key.startsWith('file-cache'))[0]),
					accessRandToken = crypto.randomUUID()
				;

				await fileCache.put(accessRandToken, new Response(fileData));

				return Response.redirect(`/?share=${accessRandToken}`, 303);

			})());

			break;
		}

		case "GET": {
			break;
		}
	}
})

addEventListener("message", async ({ data: { type, body, uuid } }) => {
	switch(type) {
		case "img-bitmap": {

			Object.assign(imgEncoderOSC, { width, height });
			
			imgEncoder2d.drawImage(body, 0, 0);

			const encodedWebpBlob = await imgEncoderOSC.convertToBlob({ type: "image/webp", quality: 1 });
			Object.assign(imgEncoderOSC, imgEncoderZeroSize);

			const compressedWebpReadable = encodedWebpBlob.stream().pipeThrough(compressor);
		}
	}
})