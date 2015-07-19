run:
	cd lantern-site && cactus serve

build:
	cd lantern-site && rm -rf .build && cactus build && cp -r .build build
