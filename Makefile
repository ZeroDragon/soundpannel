export DIR=$(notdir $(shell pwd))

build.shell:
	docker run --rm -ti \
	--env ELECTRON_CACHE="/root/.cache/electron" \
	--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
	-v ${PWD}:/project \
	-v ${DIR}-node-modules:/project/node_modules \
	-v ~/.cache/electron:/root/.cache/electron \
	-v ~/.cache/electron-builder:/root/.cache/electron-builder \
	electronuserland/builder:wine

build.win:
	docker run --rm -ti \
	--env ELECTRON_CACHE="/root/.cache/electron" \
	--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
	-v ${PWD}:/project \
	-v ${DIR}-node-modules:/project/node_modules \
	-v ~/.cache/electron:/root/.cache/electron \
	-v ~/.cache/electron-builder:/root/.cache/electron-builder \
	electronuserland/builder:wine \
	/bin/bash -c "npm run build-win"

build.mac:
	npm run build-mac
