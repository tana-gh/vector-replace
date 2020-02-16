import * as assert  from 'assert'
import * as types   from '../../../core/types'
import * as replace from '../../../core/replace'

suite('replace', () => {
    test('normal replace with empty replaceStrings', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = <string[]>[]
        const replaceFuncs   = replace.createReplaceFuncs(replaceStrings)
        const matches        = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
        ]

        const output = replace.replace(input, replaceFuncs, matches)

        assert.equal(output, '-abc-defgh-ijk-')
    })

    test('normal replace', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '3', '456' ]
        const replaceFuncs   = replace.createReplaceFuncs(replaceStrings)
        const matches        = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
        ]

        const output = replace.replace(input, replaceFuncs, matches)

        assert.equal(output, '-12-3-456-')
    })

    test('regexp replace with empty replaceStrings', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = <string[]>[]
        const replaceFuncs   = replace.createReplaceFuncs(replaceStrings)
        const matches        = [
            types.createMatchResult([ 'abc'   ],  1, input, /\w{3}/g),
            types.createMatchResult([ 'defgh' ],  5, input, /\w{5}/g),
            types.createMatchResult([ 'ijk'   ], 11, input, /\w{3}/g),
        ]

        const output = replace.replace(input, replaceFuncs, matches)

        assert.equal(output, '-abc-defgh-ijk-')
    })

    test('regexp replace', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12$1', '3$1', '456$1$2' ]
        const replaceFuncs   = replace.createReplaceFuncs(replaceStrings)
        const matches        = [
            types.createMatchResult([ 'abc'   ],  1, input, /a(b)c/g  ),
            types.createMatchResult([ 'defgh' ],  5, input, /(\w{5})/g),
            types.createMatchResult([ 'ijk'   ], 11, input, /(i)j(k)/g),
        ]

        const output = replace.replace(input, replaceFuncs, matches)

        assert.equal(output, '-12b-3defgh-456ik-')
    })
})
