先读取JS源文件目录的.env.defaults和.env文件。若读取的环境变量为空，则读取命令行运行目录的.env.defaults和.env文件。

.env.defaults设置环境变量: 
1. PORT: Http服务的监听端口。
2. WWW: Http服务的根目录，此目录应该有index.html等文件。
