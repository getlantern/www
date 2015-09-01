run:
	cd lantern-site && cactus serve

build:
	cd lantern-site && rm -rf .build build && cactus build && mv .build build

deploy: build
	cd lantern-site/build && s3cmd sync -P --recursive . s3://getlantern.org
