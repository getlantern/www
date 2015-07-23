# getlantern.org

This site requires [cactus](https://github.com/koenbok/Cactus).

```
make run
# Running webserver at http://127.0.0.1:8000 for /Users/rev/projects/lantern/www/lantern-site/.build
# Type control-c to exit
```

## Creating a build

In order to create a build use the `build` target of the Makefile.

```
make build
```

Then upload the contents of the `lantern-site/build` directory.

## Deploying to getlantern.org

Use the `deploy` target to upload the contents of the `lantern-site/build`
directory.

```
make deploy
```
