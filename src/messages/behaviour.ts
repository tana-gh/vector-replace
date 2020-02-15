import * as vscode          from 'vscode'
import * as logic           from '../core/logic'
import * as coreTypes       from '../core/types'
import * as messageTypes    from './types'
import * as state           from '../states/state'
import * as rangeUtil       from '../util/range'

export const execute = (message: messageTypes.MessageTypes, st: state.State) => {
    switch (message.command) {
        case 'runSearch':
            runSearch(message, st)
            return
        case 'runReplace':
            runReplace(message, st)
            return
    }
}

const runSearch = (message: messageTypes.RunSearchCommand, st: state.State) => {
    const editor = getEditor()
    if (!editor) return
    
    logic.setInput(st.vr, getInput(editor))
    logic.setSearchStrings(st.vr, message.searchStr)
    logic.runSearch(st.vr)
    decorate(editor, st.decoration, st.vr.matches)
}

const runReplace = (message: messageTypes.RunReplaceCommand, st: state.State) => {
    const editor = getEditor()
    if (!editor) return

    logic.setInput(st.vr, getInput(editor))
    logic.setSearchStrings (st.vr, message.searchStr)
    logic.setReplaceStrings(st.vr, message.replaceStr)
    logic.runSearch (st.vr)
    logic.runReplace(st.vr)
    setOutput(editor, st.vr.text)
}

const getEditor = () => {
    if (vscode.window.visibleTextEditors.length === 0) return undefined
    return vscode.window.visibleTextEditors[0]
}

const getInput = (editor: vscode.TextEditor) => {
    return editor.document.getText()
}

const decorate = (
    editor: vscode.TextEditor,
    decoration: vscode.TextEditorDecorationType,
    matches: coreTypes.MatchResult[]
) => {
    const ranges = rangeUtil.createRanges(matches)
    editor.setDecorations(decoration, ranges)
}

const setOutput = (editor: vscode.TextEditor, text: string) => {
    editor.edit(edit => {
        const range = new vscode.Range(0, 0, editor.document.lineCount, 0)
        edit.replace(range, text)
    })
}
