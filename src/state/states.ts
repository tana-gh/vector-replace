import * as vscode       from 'vscode'
import * as coreTypes    from '../core/types'

export let vr        : coreTypes.VectorReplace
export let decoration: vscode.TextEditorDecorationType

export const init = () => {
    vr         = createVectorReplace()
    decoration = createDecoration()
    return [ decoration ]
}

const createVectorReplace = () =>
    coreTypes.createVectorReplace()

const createDecoration = () =>
    vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground')
    })

export const dispose = () => {
    decoration.dispose()
}
