import * as vscode       from 'vscode'
import * as logic        from '../core/logic'
import * as coreTypes    from '../core/types'
import * as messageTypes from './types'

export const execute = (message: messageTypes.MessageTypes) => {
    switch (message.command) {
        case 'runReplace':
            runReplace(message)
            return
    }
}

const runReplace = (message: messageTypes.RunReplaceCommand) => {
    if (vscode.window.visibleTextEditors.length === 0) return
    const editor = vscode.window.visibleTextEditors[0]

    const vr = createVectorReplace()
    logic.setInput(vr, getInput(editor))
    logic.setSearchStrings (vr, message.searchStr)
    logic.setReplaceStrings(vr, message.replaceStr)
    logic.runSearch (vr)
    logic.runReplace(vr)
    setOutput(editor, vr.text)
}

const getInput = (editor: vscode.TextEditor) => {
    return editor.document.getText()
}

const setOutput = (editor: vscode.TextEditor, text: string) => {
    editor.edit(edit => {
        //const endLine = editor.document.lineCount - 1
        //const endChar = editor.document.lineAt(endLine).text.length - 1
        const range = new vscode.Range(0, 0, editor.document.lineCount, 0)
        edit.replace(range, text)
    })
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