# This is the web site for https://lantern.io

This site requires [Jinja2](jinja.pocoo.org).

`make run` to build and serve HTML on 8000 port. Visiting / redirects to preferred language of the browser, or `en_US` if the language is not supported.

Modify bin/config.py to add more supported languages.

`make deploy-beta` deploys to http://beta.getlantern.org.s3-website-us-east-1.amazonaws.com/

`make deploy` deploys to https://getlantern.org, plus all S3 mirrors.

`make run` runs a local version at http://localhost:8000

## Translations

To update translations, you need the transifex CLI tool. You can install this with:

`pip install transifex-client`

You can then pull in translations with:

`tx pull`

Then you need to commit them to the repository and deploy using one of the above make targets.
