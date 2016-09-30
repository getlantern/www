SOURCE ?= getlantern.org
get-command = $(shell which="$$(which $(1) 2> /dev/null)" && if [[ ! -z "$$which" ]]; then printf %q "$$which"; fi)

S3CMD := $(call get-command,s3cmd)

MIRRORS  := $(LANTERN_WEBSITE_MIRRORS)

run:
	cd $(SOURCE) && cactus serve

build:
	cd $(SOURCE) && rm -rf .build build && cactus build -c config.json && mv .build build

deploy-beta: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://beta.getlantern.org

deploy-cn-mirrors: build
	echo "Copying CN index to main directory" && \
	cp $(SOURCE)/pages/index.html $(SOURCE)/tmp.html && \
	cp $(SOURCE)/pages/CN/index.html $(SOURCE)/pages/index.html && \
	cd $(SOURCE)/build && \
	for NAME in $(MIRRORS); do \
		echo "Deploying to $$NAME" && \
		$(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive . s3://$$NAME; \
	done; \
	mv ../tmp.html ../pages/index.html

deploy-prod: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://getlantern.org

