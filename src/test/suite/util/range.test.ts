import * as assert    from 'assert'
import * as vscode    from 'vscode'
import * as types     from '../../../core/types'
import * as search    from '../../../core/search'
import * as rangeUtil from '../../../util/range'

const assertRange = (range: vscode.Range, l0: number, c0: number, l1: number, c1: number) => {
    assert.strictEqual(range.start.line     , l0)
    assert.strictEqual(range.start.character, c0)
    assert.strictEqual(range.end  .line     , l1)
    assert.strictEqual(range.end  .character, c1)
}

const runGenerator = (gen: Generator<number, types.MatchResult[]>) => {
    while (true) {
        const next = gen.next()
        if (next.done) return next.value
    }
}

suite('range util', () => {
    test('createRanges empty', () => {
        const ranges = rangeUtil.createRanges([])

        assert.strictEqual(ranges.length, 0)
    })

    test('createRanges', () => {
        const input         = '-abc\n-def\ngh-ijk'
        const searchStrings = [ 'abc', 'def\ngh', 'ijk' ]
        
        const params = types.createParams()
        params.useRegExp = false

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = runGenerator(search.search(input, input, [], searchFuncs, params, { isCancelled: false }))

        const ranges = rangeUtil.createRanges(matches)

        assert.strictEqual(ranges.length, 3)
        assertRange(ranges[0], 0, 1, 0, 4)
        assertRange(ranges[1], 1, 1, 2, 2)
        assertRange(ranges[2], 2, 3, 2, 6)
    })

    test('toIndicesFromPositions', () => {
        const input = '-abc\n-def\ngh-ijk'
        const positions = [
            new vscode.Position(0, 0),
            new vscode.Position(0, 1),
            new vscode.Position(0, 2),
            new vscode.Position(0, 3),
            new vscode.Position(0, 4),
            new vscode.Position(1, 0),
            new vscode.Position(1, 1),
            new vscode.Position(1, 2),
            new vscode.Position(1, 3),
            new vscode.Position(1, 4),
            new vscode.Position(2, 0),
            new vscode.Position(2, 1),
            new vscode.Position(2, 2),
            new vscode.Position(2, 3),
            new vscode.Position(2, 4),
            new vscode.Position(2, 5),
            new vscode.Position(2, 6)
        ]

        const indices = rangeUtil.toIndicesFromPositions(input, positions)

        assert.deepStrictEqual(indices, [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ])
    })
})
