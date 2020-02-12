import * as vscode       from 'vscode'
import * as logic        from '../core/logic'
import * as coreTypes    from '../core/types'
import * as messageTypes from './types'
import * as states       from '../state/states'

export const execute = (message: messageTypes.MessageTypes) => {
    switch (message.command) {
        case 'runSearch':
            runSearch(message)
            return
        case 'runReplace':
            runReplace(message)
            return
    }
}

const runSearch = (message: messageTypes.RunSearchCommand) => {
    const editor = getEditor()
    if (!editor) return
    
    logic.setInput(states.vr, getInput(editor))
    logic.setSearchStrings(states.vr, message.searchStr)
    logic.runSearch(states.vr)
    decorate(editor, states.vr.matches)
}

const runReplace = (message: messageTypes.RunReplaceCommand) => {
    const editor = getEditor()
    if (!editor) return

    logic.setInput(states.vr, getInput(editor))
    logic.setSearchStrings (states.vr, message.searchStr)
    logic.setReplaceStrings(states.vr, message.replaceStr)
    logic.runSearch (states.vr)
    logic.runReplace(states.vr)
    setOutput(editor, states.vr.text)
}

const getEditor = () => {
    if (vscode.window.visibleTextEditors.length === 0) return undefined
    return vscode.window.visibleTextEditors[0]
}

const getInput = (editor: vscode.TextEditor) => {
    return editor.document.getText()
}

const decorate = (editor: vscode.TextEditor, matches: coreTypes.MatchResult[]) => {
    const ranges = createDecorationRanges(matches)
    editor.setDecorations(states.decoration, ranges)
}

const createDecorationRanges = (matches: coreTypes.MatchResult[]) => {
    return matches.map(match => new vscode.Range(0, match.index, 0, match.index + match[0].length))
}

const setOutput = (editor: vscode.TextEditor, text: string) => {
    editor.edit(edit => {
        const range = new vscode.Range(0, 0, editor.document.lineCount, 0)
        edit.replace(range, text)
    })
}
