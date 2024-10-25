navigator.serviceWorker.register("./sw.js");

const [swr, data] = await Promise.all([

	navigator.serviceWorker.ready,

	new Promise(resolveShare => {

		addEventListener("load", async (loadEvent) => {
			// get cache access token
			const accessRandToken = new URLSearchParams(window.location.search).get("share");
			if(!accessRandToken) resolveShare();
			// get response from cache
			const
				fileCache = await caches.open(cacheKeys.filter((key) => key.startsWith('file-cache'))[0]),
				fileRes = await fileCache.match(accessRandToken)
			;
			if(!fileRes) resolveShare();
			await fileCache.delete(accessRandToken);
		
			// get file blob
			const fileBlob = await fileRes.blob();
		
			// get type and subtype of blob
			const [fileType, fileSubType] = fileBlob.type.split("/");
		
			switch(fileType) {
				case "image": {
					switch(fileSubType) {
		
						// re-encode blob to webp when the type is png or jpeg
						case "png":
						case "jpeg": {
							const
								imgBitmap = await createImageBitmap(fileBlob)
							;
							resolveShare({ type: "img-bitmap", body: imgBitmap });
							break;
						}

						default: {
							resolveShare({ type: "blob", body: fileBlob })
						}
					}
				}
			}
		})
	})
])

if(data) {
	const { type, body } = data;
	swr.active.postMessage({ type, body });

}
