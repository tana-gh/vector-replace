import * as vscode from 'vscode'
import * as fs     from 'fs'
import * as path   from 'path'

export const activate = (context: vscode.ExtensionContext) => {
    const showView = vscode.commands.registerCommand('vectorreplace.showView', () => {
        const htmlPath = path.join(context.extensionPath, 'media', 'views', 'vector-replace.html')

        const panel = vscode.window.createWebviewPanel('vectorreplace', 'Vector Replace', vscode.ViewColumn.Beside)
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) throw err
            panel.webview.html = data
        })
    })
    context.subscriptions.push(showView)
}

export const deactivate = () => {
}
