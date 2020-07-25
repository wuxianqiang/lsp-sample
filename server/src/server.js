const { createConnection, TextDocuments, ProposedFeatures, CompletionItemKind, TextDocumentSyncKind } = require("vscode-languageserver");
const { TextDocument } = require("vscode-languageserver-textdocument");

// 为服务创建连接，通过IPC管道与客户端通讯
let connection = createConnection(ProposedFeatures.all);
// npm模块，用于实现使用Node.js作为运行时的LSP服务器中可用的文本文档：
let documents = new TextDocuments(TextDocument);

connection.onInitialize((params) => {
    connection.console.log('hello');
	const result = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// 告诉客户端支持代码提示
			completionProvider: {
				resolveProvider: true
			}
		}
	};
	return result;
});

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('hello');
});
// 初始化一个代码提示的列表给我们选择
connection.onCompletion((_textDocumentPosition) => {
    return [
        {
            label: 'TypeScript',
            kind: CompletionItemKind.Text,
            data: 1
        },
        {
            label: 'JavaScript',
            kind: CompletionItemKind.Text,
            data: 2
        }
    ];
});
// 当选中某个代码提示的选项时提示详情信息
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'TypeScript details';
        item.documentation = 'TypeScript documentation1';
    }
    else if (item.data === 2) {
        item.detail = 'JavaScript details';
        item.documentation = 'JavaScript documentation1';
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// 监听连接
connection.listen();