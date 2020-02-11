import * as vscode       from 'vscode'
import * as logic        from '../core/logic'
import * as coreTypes    from '../core/types'
import * as messageTypes from './types'

let vr        : coreTypes.VectorReplace
let decoration: vscode.TextEditorDecorationType

export const init = () => {
    vr         = createVectorReplace()
    decoration = createDecoration()
    return [ decoration ]
}

const createVectorReplace = () => <coreTypes.VectorReplace>({
    params        : createParams(),
    text          : '',
    searchStrings : [],
    replaceStrings: [],
    searchFuncs   : [],
    matches       : []
})

const createParams = () => <coreTypes.Params>({
    useRegExp         : false,
    ignoreCaseSearch  : false,
    skipBangSearch    : false,
    ignoreEmptySearch : false,
    ignoreEmptyReplace: false,
    loopSearch        : false,
    loopReplace       : false,
    smartReplace      : false
})

const createDecoration = () =>
    vscode.window.createTextEditorDecorationType({
        backgroundColor: new vscode.ThemeColor('editor.findMatchHighlightBackground')
    })

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
    
    logic.setInput(vr, getInput(editor))
    logic.setSearchStrings(vr, message.searchStr)
    logic.runSearch(vr)
    decorate(editor, vr.matches)
}

const runReplace = (message: messageTypes.RunReplaceCommand) => {
    const editor = getEditor()
    if (!editor) return

    logic.setInput(vr, getInput(editor))
    logic.setSearchStrings (vr, message.searchStr)
    logic.setReplaceStrings(vr, message.replaceStr)
    logic.runSearch (vr)
    logic.runReplace(vr)
    setOutput(editor, vr.text)
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
    editor.setDecorations(decoration, ranges)
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
