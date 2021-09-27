# 用MDX写作，用浏览器或Pdf演示

## 构建

```bash
git clone https://github.com/szdailei/www
cd www
yarn
yarn build
```

## 打包

```bash
yarn pkg-fetch
set courses-dir in packer/packer.toml
yarn packer
```

## 运行

```bash
set static-server.root in dist/static-server/static-server.toml
set storage.root in dist/api-server/api-server.toml
./dist/start-servers
```

## 停止运行

```bash
./dist/stop-servers
```