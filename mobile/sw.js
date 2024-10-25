const pendingReciever = {};
const compressor = new CompressionStream("deflate");
const imgEncoderOSC = new OffscreenCanvas(0, 0);
const imgEncoderCtx = imgEncoderOSC.getContext("2d");

/**
 * 
 * @param { ReadableStream } rawReadable 
 * @returns { ReadableStream }
 */
const createCompressedStream = (rawReadable) => rawReadable.pipeThrough(compressor);

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
				return Response.redirect(`./share?t=${accessRandToken}`, 303);
			})())
				const [fileType, fileSubType] = fileData.type.split("/");	
				switch(fileType) {
					case "image": {
						switch(fileSubType) {
							case "webp":
							case "avif": break;

							default: {
								const imgBitmap = await createImageBitmap(fileData);

							}
						}
					}
				}
			fetchEvent.respondWith();
			break;
		}

		case "GET": {
			break;
		}
	}
})