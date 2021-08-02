先读取JS源文件目录的.env.defaults和.env文件。若读取的环境变量为空，则读取命令行运行目录的.env.defaults和.env文件。

.env.defaults设置环境变量: 
1. API_GATEWAY_PORT: Http服务的监听端口。
2. RULE_OF_END_POINT_API: 设置src/reverse-proxy/rules.mjs里面的转发规则，转发到哪个服务器。
