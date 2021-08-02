安装chromium，在.env.defaults里面指定chromium可执行文件。

开发环境下，在.env里面设置环境变量NODE_TLS_REJECT_UNAUTHORIZED=0

.env.defaults设置环境变量: 
- API_SERVER_PORT: Http服务的监听端口。
- STORAGE_DIR: 存放courses和resume文件的目录。
- DOWNLOAD_ROOT_DIR: 下载服务器的根目录，用于下载pdf和images文件。
- TEMP_DOWNLOAD_DIR: 存放和下载pdf文件的相对目录。
- DOWNLOAD_SERVER_PORT: 下载服务器的Port，用于将WEB页面转换为PDF文件下载。
- DATABASE_HOST
- DATABASE_PORT=5432
- DATABASE_NAME
- DATABASE_USER
- PUPPETEER_EXECUTABLE_PATH: chromium应用程序的路径，用于从web页面生成pdf。

.env设置环境变量: 
- DATABASE_PASSWORD
- NODE_TLS_REJECT_UNAUTHORIZED=0: 忽略对证书的验证，用于使用自签名证书进行测试，发布版本必须删除此环境变量。
- NODE_EXTRA_CA_CERTS: nodejs使用此环境变量加载额外的根证书机构的公钥文件(.crt)，通常没有必要。
