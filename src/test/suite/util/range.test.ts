import * as assert    from 'assert'
import * as vscode    from 'vscode'
import * as types     from '../../../core/types'
import * as search    from '../../../core/search'
import * as rangeUtil from '../../../util/range'

const assertRange = (range: vscode.Range, l0: number, c0: number, l1: number, c1: number) => {
    assert.equal(range.start.line     , l0)
    assert.equal(range.start.character, c0)
    assert.equal(range.end  .line     , l1)
    assert.equal(range.end  .character, c1)
}

suite('range util', () => {
    test('createRanges', () => {
        const ranges = rangeUtil.createRanges([])

        assert.equal(ranges.length, 0)
    })

    test('createRanges', () => {
        const input         = '-abc\n-def\ngh-ijk'
        const searchStrings = [ 'abc', 'def\ngh', 'ijk' ]
        
        const params = types.createParams()
        params.useRegExp = false

        const searchFuncs   = search.createSearchFuncs(searchStrings, params)
        const matches       = search.search(input, input, searchFuncs, params)

        const ranges = rangeUtil.createRanges(matches)

        assert.equal(ranges.length, 3)
        assertRange(ranges[0], 0, 1, 0, 4)
        assertRange(ranges[1], 1, 1, 2, 2)
        assertRange(ranges[2], 2, 3, 2, 6)
    })
})
