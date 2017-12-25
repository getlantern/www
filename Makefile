get-command = $(shell which="$$(which $(1) 2> /dev/null)" && if [[ ! -z "$$which" ]]; then printf %q "$$which"; fi)

S3CMD := $(call get-command,s3cmd)
WGET 		  := $(call get-command,wget)
S3_BUCKET ?= lantern

require-secrets-dir:
	@if [[ -z "$$SECRETS_DIR" ]]; then echo "SECRETS_DIR environment value is required."; exit 1; fi

require-s3cmd:
	@if [[ -z "$(S3CMD)" ]]; then echo 'Missing "s3cmd" command. Use "brew install s3cmd" or see https://github.com/s3tools/s3cmd/blob/master/INSTALL'; exit 1; fi

require-wget:
	@if [[ -z "$(WGET)" ]]; then echo 'Missing "wget" command.'; exit 1; fi

require-jinja2:
	@if [[ -z "$(shell pip show Jinja2)" ]]; then echo '"pip install Jinja2" first'; exit 1; fi

gen-lang: require-jinja2
	bin/gen-lang.py

build: gen-lang
	rm -rf .build build && bin/build.py # && cp -R fanqiang build/

run: build
	cd build && python -m SimpleHTTPServer

copy-installers: require-secrets-dir
	@URLS="$$(make get-installer-urls)" && \
	for NAME in $(shell cat "$(SECRETS_DIR)/website-mirrors.txt"); do \
		echo "Copying installers to $$NAME"; \
		for URL in $$URLS; do \
			$(S3CMD) cp s3://$(S3_BUCKET)/$$URL s3://$$NAME && \
			$(S3CMD) setacl s3://$$NAME/$$URL --acl-public; \
		done; \
	done; \
	echo "Finished copying installers to mirrors"

deploy-beta: build
	cd build && $(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive --no-mime-magic --guess-mime-type . s3://beta.getlantern.org && \
	echo "Done! Visit http://beta.getlantern.org.s3-website-us-east-1.amazonaws.com/"

get-installer-urls: require-wget
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
	cp pages/index.html tmp.html && \
	cp pages/CN/index.html pages/index.html

deploy-cn-mirrors: require-secrets-dir copy-cn-index build
	cd build && \
	for NAME in $(shell cat "$(SECRETS_DIR)/website-mirrors.txt"); do \
		echo "Deploying to $$NAME" && \
		$(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive --no-mime-magic --guess-mime-type . s3://$$NAME; \
	done; \
	mv ../tmp.html ../pages/index.html

deploy-prod: build
	cd build && $(S3CMD) --acl-public --add-header='Cache-Control: private, max-age=0, no-cache' sync -P --recursive --no-mime-magic --guess-mime-type . s3://getlantern.org

