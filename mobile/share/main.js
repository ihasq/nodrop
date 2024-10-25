addEventListener("load", async (loadEvent) => {

	const accessRandToken = new URLSearchParams(window.location.search).get("t");
	if(!accessRandToken) return;

	const
		fileCache = await caches.open(cacheKeys.filter((key) => key.startsWith('file-cache'))[0]),
		fileRes = await fileCache.match(accessRandToken)
	;
	if(!fileRes) return;

	const fileBlob = await fileRes.blob();
	await fileCache.delete(accessRandToken);

	const [fileType, fileSubType] = fileBlob.type.split("/");
	switch(fileType) {
		case "image": {
			switch(fileSubType) {
				case "avif":
				case "webp":
				case "svg": break;

				default: {
					const imgBitmap = await createImageBitmap(fileBlob);
					
				}
			}
		}
	}
})