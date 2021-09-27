export default `Usage: packer [options]

工作步骤如下：
1. 将js文件与nodejs打包成可执行文件，放在dist的各个服务器目录。
2. 拷贝index.html, app.js等文件到dist/web目录。
3. 拷贝courses-dir到dist/courses。
4. 拷贝local-presentation.html到dist目录。
5. 拷贝target-scripts的脚本到dist目录。

Options:
  -h, --help  Display help for command.`;
