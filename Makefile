SOURCE ?= getlantern.org
get-command = $(shell which="$$(which $(1) 2> /dev/null)" && if [[ ! -z "$$which" ]]; then printf %q "$$which"; fi)

S3CMD := $(call get-command,s3cmd)

MIRRORS := 0uDkf9M7o7Sly iwdVimROsFw0d KSthdk7KS7ycl fQYE8L3Gw1AQI x9BcOHsiGoVJf S6fMIx2ZKbpsT skiRqyeZV78kC dktwQPem0dVrJ I8L5HZbjsIHut 3mx79KFbqdGAS

run:
	cd $(SOURCE) && cactus serve

build:
	cd $(SOURCE) && rm -rf .build build && cactus build && mv .build build

deploy-beta: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://beta.getlantern.org

deploy-mirrors: build
	cd $(SOURCE)/build && \
	for NAME in $(MIRRORS); do \
		echo "Deploying to $$NAME" && \
		aws s3 mb s3://$$NAME && \
		$(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive . "s3://$$NAME.getlantern.org"; \
	done

deploy-prod: build
	cd $(SOURCE)/build && s3cmd sync -P --recursive . s3://getlantern.org

