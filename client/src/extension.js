const path = require("path");
const { workspace } = require("vscode");
const { TransportKind, LanguageClient } = require("vscode-languageclient");
let client;

console.log('client')
function activate(context) {
    // node 服务器路径
    let serverModule = context.asAbsolutePath(path.join('server', 'src', 'server.js'));
    // --inspect=6009: 开启调试模式
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // 如果插件在调试模式下启动，则使用调试服务器选项，否则将使用运行选项
    let serverOptions = {
        // 运行时的参数
        run: { module: serverModule, transport: TransportKind.ipc },
        // 调试时的参数
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };
    // 语言客户端的一些参数
    let clientOptions = {
        // 为纯文本文档注册服务器
        documentSelector: [{ scheme: 'file', language: 'plaintext' }],
        synchronize: {
            // 在“.clientrc文件”的文件更改通知服务器，如果不想校验这个代码可以在这里配置
            // fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // 创建客户端
    client = new LanguageClient('languageServerExample', 'Language Server Example', serverOptions, clientOptions);
    // 启动
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;