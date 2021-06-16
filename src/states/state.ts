import * as vscode    from 'vscode'
import * as coreTypes from '../core/types'

export interface State {
    vr            : coreTypes.VectorReplace
    webview       : vscode.Webview    | undefined
    editor        : vscode.TextEditor | undefined
    decoration    : vscode.TextEditorDecorationType
    refreshTimeout: NodeJS.Timeout | undefined
    processObject : ProcessObject  | undefined
}

export interface ProcessObject {
    isCancelled: boolean
}

export const create = (webview: vscode.Webview | undefined, editor: vscode.TextEditor | undefined) => <State>({
    vr            : createVectorReplace(),
    webview       : webview,
    editor        : editor,
    decoration    : createDecoration(),
    refreshTimeout: undefined,
    processObject : undefined
})

const createVectorReplace = () =>
    coreTypes.createVectorReplace()

const createDecoration = () =>
    vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('merge.currentHeaderBackground')
    })

export const setEditor = (st: State, editor: vscode.TextEditor | undefined) => {
    if (!editor) return
    st.editor = editor
}

export const resetProcessObject = (st: State) => {
    if (st.processObject) st.processObject.isCancelled = true
    st.processObject = { isCancelled: false }
    st.webview?.postMessage({ type: 'progressVisible', value: true })
}

export const clearProcessObject = (st: State, po: ProcessObject) => {
    if (st.processObject === po) {
        st.processObject = undefined
        st.webview?.postMessage({ type: 'progressVisible', value: false })
    }
}

export const reportProgress = (st: State, po: ProcessObject, method: string, progress: number) => {
    if (st.processObject === po) st.webview?.postMessage({ type: 'progress', method, value: progress })
}

export const dispose = (st: State) => {
    if (st.processObject) st.processObject.isCancelled = true
    st.decoration.dispose()
    if (st.refreshTimeout) clearInterval(st.refreshTimeout)
}
