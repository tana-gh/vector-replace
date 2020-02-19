import * as vscode       from 'vscode'
import * as logic        from '../core/logic'
import * as coreTypes    from '../core/types'
import * as messageTypes from './types'
import * as state        from '../states/state'
import * as rangeUtil    from '../util/range'

export const execute = (message: messageTypes.MessageTypes, st: state.State) => {
    switch (message.command) {
        case 'refresh':
            refresh(st)
            return
        case 'runSearch':
            runSearch(message, st)
            return
        case 'runReplace':
            runReplace(message, st)
            return
        case 'setUseRegExp':
            setUseRegExp(message, st)
            return
        case 'setIgnoreCaseSearch':
            setIgnoreCaseSearch(message, st)
            return
    }
}

export const refresh = (st: state.State) => {
    if (!st.editor) return

    logic.setInput(st.vr, getInput(st.editor))
    logic.runSearch(st.vr)
    decorate(st.editor, st.decoration, st.vr.matches)
}

const runSearch = (message: messageTypes.RunSearchCommand, st: state.State) => {
    logic.setSearchStrings(st.vr, message.searchStr)
    
    if (!st.editor) return
    
    logic.setInput(st.vr, getInput(st.editor))
    logic.runSearch(st.vr)
    decorate(st.editor, st.decoration, st.vr.matches)
}

const runReplace = (message: messageTypes.RunReplaceCommand, st: state.State) => {
    logic.setSearchStrings (st.vr, message.searchStr)
    logic.setReplaceStrings(st.vr, message.replaceStr)

    if (!st.editor) return

    logic.setInput(st.vr, getInput(st.editor))
    logic.runSearch (st.vr)
    logic.runReplace(st.vr)
    setOutput(st.editor, st.vr.text)
}

const setUseRegExp = (message: messageTypes.SetUseRegExp, st: state.State) => {
    logic.setUseRegExp  (st.vr, message.value)
    logic.setSearchFuncs(st.vr)
    logic.runSearch     (st.vr)

    if (!st.editor) return

    decorate(st.editor, st.decoration, st.vr.matches)
}

const setIgnoreCaseSearch = (message: messageTypes.SetIgnoreCaseSearch, st: state.State) => {
    logic.setIgnoreCaseSearch(st.vr, message.value)
    logic.setSearchFuncs     (st.vr)
    logic.runSearch          (st.vr)

    if (!st.editor) return

    decorate(st.editor, st.decoration, st.vr.matches)
}

const getInput = (editor: vscode.TextEditor) => {
    return editor.document.getText()
}

const decorate = (
    editor    : vscode.TextEditor,
    decoration: vscode.TextEditorDecorationType,
    matches   : coreTypes.MatchResult[]
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
