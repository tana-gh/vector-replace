import * as vscode  from 'vscode'
import * as fs      from 'fs'
import * as path    from 'path'
import * as message from './messages/behaviour'

let disposables: vscode.Disposable[]

export const activate = (context: vscode.ExtensionContext) => {
    disposables = message.init()

    const showView = vscode.commands.registerCommand('vectorreplace.showView', () => {
        const htmlPath = path.join(context.extensionPath, 'media', 'views', 'vector-replace.html')

        const panel = vscode.window.createWebviewPanel('vectorreplace', 'Vector Replace', vscode.ViewColumn.Beside, { enableScripts: true })
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) throw err
            panel.webview.html = data
        })

        panel.webview.onDidReceiveMessage(mes => message.execute(mes))
    })
    context.subscriptions.push(showView)
}

export const deactivate = () => {
    disposables.forEach(d => d.dispose())
}
