SOURCE ?= getlantern.org
get-command = $(shell which="$$(which $(1) 2> /dev/null)" && if [[ ! -z "$$which" ]]; then printf %q "$$which"; fi)

S3CMD := $(call get-command,s3cmd)
WGET 		  := $(call get-command,wget)

MIRRORS  := $(LANTERN_WEBSITE_MIRRORS)
S3_BUCKET ?= lantern



space :=
space +=
join-with = $(subst $(space),$1,$(strip $2))

require-s3cmd:
	@if [[ -z "$(S3CMD)" ]]; then echo 'Missing "s3cmd" command. Use "brew install s3cmd" or see https://github.com/s3tools/s3cmd/blob/master/INSTALL'; exit 1; fi

require-wget:
	@if [[ -z "$(WGET)" ]]; then echo 'Missing "wget" command.'; exit 1; fi

run:
	cd $(SOURCE) && cactus serve

build:
	cd $(SOURCE) && rm -rf .build build && cactus build -c config.json && mv .build build

copy-installers:
	@URLS="$(shell make fetch-installers)" && \
	for NAME in $(MIRRORS); do \
		echo "Copying installers to $$NAME"; \
		for URL in $$URLS; do \
			$(S3CMD) cp s3://$(S3_BUCKET)/$$URL s3://$$NAME && \
			$(S3CMD) setacl s3://$$NAME/$$URL --acl-public; \
		done; \
	done; \
	echo "DONE"

deploy-beta: build copy-installers
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://beta.getlantern.org

fetch-installers: require-wget
	@BASE_NAME="lantern-installer-internal" && \
	URLS="" && \
	BETA_BASE_NAME="lantern-installer-beta" && \
	for URL in $$($(S3CMD) ls s3://$(S3_BUCKET)/ | grep $$BASE_NAME | awk '{print $$4}'); do \
		NAME=$$(basename $$URL) && \
		BETA=$$(echo $$NAME | sed s/"$$BASE_NAME"/$$BETA_BASE_NAME/) && \
		URLS+=$$(echo " $$BETA"); \
	done && \
	echo "$$URLS" | xargs

copy-cn-index:
	echo "Copying CN index to main directory" && \
	cp $(SOURCE)/pages/index.html $(SOURCE)/tmp.html && \
	cp $(SOURCE)/pages/CN/index.html $(SOURCE)/pages/index.html

deploy-cn-mirrors: copy-installers copy-cn-index build
	cd $(SOURCE)/build && \
	for NAME in $(MIRRORS); do \
		echo "Deploying to $$NAME" && \
		$(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive . s3://$$NAME; \
	done; \
	mv ../tmp.html ../pages/index.html

deploy-prod: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://getlantern.org

