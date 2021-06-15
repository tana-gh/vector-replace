import * as vscode    from 'vscode'
import * as coreTypes from '../core/types'

export interface State {
    vr            : coreTypes.VectorReplace
    editor        : vscode.TextEditor | undefined
    decoration    : vscode.TextEditorDecorationType
    refreshTimeout: NodeJS.Timeout | undefined
}

export const create = (editor: vscode.TextEditor | undefined) => <State>({
    vr            : createVectorReplace(),
    editor        : editor,
    decoration    : createDecoration(),
    refreshTimeout: undefined
})

const createVectorReplace = () =>
    coreTypes.createVectorReplace()

const createDecoration = () =>
    vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('merge.currentHeaderBackground')
    })

export const dispose = (st: State) => {
    if (st.vr.processObject) st.vr.processObject.isCancelled = true
    st.decoration.dispose()
    if (st.refreshTimeout) clearInterval(st.refreshTimeout)
}

export const setEditor = (st: State, editor: vscode.TextEditor | undefined) => {
    if (!editor) return
    st.editor = editor
}
