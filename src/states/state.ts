import * as vscode    from 'vscode'
import * as coreTypes from '../core/types'

export interface State {
    vr        : coreTypes.VectorReplace
    decoration: vscode.TextEditorDecorationType
}

export const create = () => ({
    vr        : createVectorReplace(),
    decoration: createDecoration()
})

const createVectorReplace = () =>
    coreTypes.createVectorReplace()

const createDecoration = () =>
    vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground')
    })

export const dispose = (st: State) => {
    st.decoration.dispose()
}
