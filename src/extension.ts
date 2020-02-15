import * as vscode    from 'vscode'
import * as fs        from 'fs'
import * as path      from 'path'
import * as state     from './states/state'
import * as behaviour from './messages/behaviour'

export const activate = (context: vscode.ExtensionContext) => {
    const showView = vscode.commands.registerCommand('vectorreplace.showView', showViewCommand(context))
    context.subscriptions.push(showView)
}

const showViewCommand = (context: vscode.ExtensionContext) => () => {
    const panel = vscode.window.createWebviewPanel('vectorreplace', 'Vector Replace', vscode.ViewColumn.Beside, { enableScripts: true })
    
    const htmlPath = path.join(context.extensionPath, 'media', 'views', 'vector-replace.html')
    readAndSetHtmlToWebview(panel.webview, htmlPath)

    const st = state.create()
    panel.webview.onDidReceiveMessage(mes => behaviour.execute(mes, st))
    panel.onDidDispose(() => state.dispose(st))
}

const readAndSetHtmlToWebview = (webview: vscode.Webview, htmlPath: string) => {
    fs.readFile(htmlPath, 'utf8', (err, data) => {
        if (err) throw err
        webview.html = data
    })
}

export const deactivate = () => {}
