import * as assert    from 'assert'
import * as vscode    from 'vscode'
import * as state     from '../../states/state'
import * as behaviour from '../../messages/behaviour'

let st         : state.State         | undefined
let document   : vscode.TextDocument | undefined
let editor     : vscode.TextEditor   | undefined
let disposables: vscode.Disposable[] | undefined

const init = async () => {
	document = await vscode.workspace.openTextDocument()
	editor   = await vscode.window.showTextDocument(document)

	st = state.create(undefined, editor)

    disposables = <vscode.Disposable[]>[
        vscode.window.onDidChangeActiveTextEditor(editor => state.setEditor(st!, editor))
    ]
}

const dispose = () => {
	disposables?.forEach(d => d.dispose())
	st          = undefined
	document    = undefined
	editor      = undefined
	disposables = undefined
}

suite('extension', () => {
	setup(init)
	teardown(dispose)

	test('replace text in editor', async () => {
		await editor!.edit(edit => edit.insert(new vscode.Position(0, 0), '-abc-defgh-ijk-'))
		await behaviour.execute({ command: 'runReplace', searchStr: 'abc\ndefgh\nijk', replaceStr: '12\n3\n456' }, st!)
		
		const text = document?.getText()

		assert.strictEqual(text, '-12-3-456-')
	})
})
