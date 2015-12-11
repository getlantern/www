SOURCE ?= getlantern.org

run:
	cd $(SOURCE) && cactus serve

build:
	cd $(SOURCE) && rm -rf .build build && cactus build && mv .build build

deploy: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://getlantern.org
	@echo 'One more thing: `aws cloudfront create-invalidation --invalidation-batch file://invalidate.json --distribution-id E1UX00QZB0FGKH`'
