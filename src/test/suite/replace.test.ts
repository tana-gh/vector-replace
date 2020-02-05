import * as assert  from 'assert'
import * as types   from '../../core/types'
import * as replace from '../../core/replace'

suite('search', () => {
    const input          = '-abc-defgh-ijk-'
    const replaceStrings = [ '12', '3', '456' ]
    const matches        = [
        types.createMatchResult([ 'abc'   ],  1, input),
        types.createMatchResult([ 'defgh' ],  5, input),
        types.createMatchResult([ 'ijk'   ], 11, input),
    ]

    const output = replace.replace(input, replaceStrings, matches)

    assert.equal(output, '-12-3-456-')
})
