run:
	cd lantern-site && cactus serve

build:
	cd lantern-site && rm -rf .build build && cactus build && mv .build build
