必须使用graphql-request 2.0.0版本，不要升级到3.0.0。3.0.0版本依赖于cross-fetch，而cross-fetch依赖于node-fetch，使用rollup打包时将依赖node模块，从而不能在浏览器中运行。

环境变量:
1. API_GATEWAY_END_POINT: API服务的URL。

MDX语法：
组件标签前面必须空一行，例如：

<Style backgroundColor=red color=white>
#Test color of heading
</Style>

gateway-config.json必须放置在静态服务器的根目录。

local-dist/local-presentation.html是不需要http服务器的本地html文件，所有的图片必须存放在local-dist/images目录下。
