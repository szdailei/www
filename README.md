# Write MDX, slide show based on browser or pdf

## Build

```bash
git clone https://github.com/szdailei/www
cd www
yarn
yarn build
```

## Bundle

```bash
yarn pkg-fetch    // fetch nodejs binary to cache dir.
set courses.root in bundle/bundle.toml
yarn bundle
```

## Run servers

```bash
set static-server.root in dist/static-server/static-server.toml
set storage.root in dist/api-server/api-server.toml
modify and run ./dist/scripts/init-database if you have database
./dist/scripts/start-servers
```

## Stop servers

```bash
./dist/scripts/stop-servers
```

## Export courses to pdfs

```bash
yarn start or ./dist/scripts/start-servers &
cd packages/test
yarn export-courses // export to pdfs folder.
```

## Slide show 

1. run browser, open web site and select one course, if servers running.
2. run browser, open dist/local-slide.html and select one course, without server.
3. run pdf reader, open pdf files.
