import * as assert  from 'assert'
import * as types   from '../../../core/types'
import * as replace from '../../../core/replace'

suite('replace', () => {
    test('normal replace with empty replaceStrings', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = <string[]>[]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-abc-defgh-ijk-')
    })

    test('normal replace', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '3', '456' ]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3-456-')
    })

    test('normal replace ignore bang', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '!3', '!!4', '56' ]

        const params = types.createParams()
        params.ignoreBangReplace = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-!4-56-')
    })

    test('normal replace not ignore bang', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '3!', '456' ]

        const params = types.createParams()
        params.ignoreBangReplace = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3!-456-')
    })

    test('normal replace not ignore empty', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '', '456' ]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12--456-')
    })

    test('normal replace ignore empty', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '', '3', '456' ]

        const params = types.createParams()
        params.ignoreEmptyReplace = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3-456-')
    })

    test('normal replace not loop', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '3' ]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3-ijk-')
    })

    test('normal replace loop', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12', '3' ]

        const params       = types.createParams()
        params.loopReplace = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  , 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3-12-')
    })

    test('normal matrix replace', () => {
        const input          = '-abc-defgh-abc-defgh-'
        const replaceStrings = [ '123', '45678', '=' ]

        const params        = types.createParams()
        params.matrixSearch = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ '-'     ],  0, input, '-'    , 2),
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  , 0),
            types.createMatchResult([ '-'     ],  4, input, '-'    , 2),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh', 1),
            types.createMatchResult([ '-'     ], 10, input, '-'    , 2),
            types.createMatchResult([ 'abc'   ], 11, input, 'abc'  , 0),
            types.createMatchResult([ '-'     ], 14, input, '-'    , 2),
            types.createMatchResult([ 'defgh' ], 15, input, 'defgh', 1),
            types.createMatchResult([ '-'     ], 20, input, '-'    , 2)
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '=123=45678=123=45678=')
    })

    test('normal replace with backslashes', () => {
        const input          = 'bbbtttrrrnnn'
        const replaceStrings = [
            '\\b',
            '\\\\b',
            '\\\\\\b',
            '\\t',
            '\\\\t',
            '\\\\\\t',
            '\\r',
            '\\\\r',
            '\\\\\\r',
            '\\n',
            '\\\\n',
            '\\\\\\n'
        ]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'b' ],  0, input, 'b',  0),
            types.createMatchResult([ 'b' ],  1, input, 'b',  1),
            types.createMatchResult([ 'b' ],  2, input, 'b',  2),
            types.createMatchResult([ 't' ],  3, input, 't',  3),
            types.createMatchResult([ 't' ],  4, input, 't',  4),
            types.createMatchResult([ 't' ],  5, input, 't',  5),
            types.createMatchResult([ 'r' ],  6, input, 'r',  6),
            types.createMatchResult([ 'r' ],  7, input, 'r',  7),
            types.createMatchResult([ 'r' ],  8, input, 'r',  8),
            types.createMatchResult([ 'n' ],  9, input, 'n',  9),
            types.createMatchResult([ 'n' ], 10, input, 'n', 10),
            types.createMatchResult([ 'n' ], 11, input, 'n', 11)
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '\\b\\\\b\\\\\\b\\t\\\\t\\\\\\t\\r\\\\r\\\\\\r\\n\\\\n\\\\\\n')
    })

    test('regexp replace with empty replaceStrings', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = <string[]>[]

        const params = types.createParams()
        params.useRegExp = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, /\w{3}/u, 0),
            types.createMatchResult([ 'defgh' ],  5, input, /\w{5}/u, 1),
            types.createMatchResult([ 'ijk'   ], 11, input, /\w{3}/u, 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-abc-defgh-ijk-')
    })

    test('regexp replace', () => {
        const input          = '-abc-defgh-ijk-'
        const replaceStrings = [ '12$1', '3$1', '456$1$2' ]

        const params = types.createParams()
        params.useRegExp = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'abc'   ],  1, input, /a(b)c/u  , 0),
            types.createMatchResult([ 'defgh' ],  5, input, /(\w{5})/u, 1),
            types.createMatchResult([ 'ijk'   ], 11, input, /(i)j(k)/u, 2),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12b-3defgh-456ik-')
    })

    test('regexp replace with backslashes', () => {
        const input          = 'bbbtttrrrnnn'
        const replaceStrings = [
            '\\b',
            '\\\\b',
            '\\\\\\b',
            '\\t',
            '\\\\t',
            '\\\\\\t',
            '\\r',
            '\\\\r',
            '\\\\\\r',
            '\\n',
            '\\\\n',
            '\\\\\\n'
        ]

        const params = types.createParams()
        params.useRegExp = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'b' ],  0, input, /b/u,  0),
            types.createMatchResult([ 'b' ],  1, input, /b/u,  1),
            types.createMatchResult([ 'b' ],  2, input, /b/u,  2),
            types.createMatchResult([ 't' ],  3, input, /t/u,  3),
            types.createMatchResult([ 't' ],  4, input, /t/u,  4),
            types.createMatchResult([ 't' ],  5, input, /t/u,  5),
            types.createMatchResult([ 'r' ],  6, input, /r/u,  6),
            types.createMatchResult([ 'r' ],  7, input, /r/u,  7),
            types.createMatchResult([ 'r' ],  8, input, /r/u,  8),
            types.createMatchResult([ 'n' ],  9, input, /n/u,  9),
            types.createMatchResult([ 'n' ], 10, input, /n/u, 10),
            types.createMatchResult([ 'n' ], 11, input, /n/u, 11)
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '\\b\\b\\\\b\t\\t\\\t\r\\r\\\r\n\\n\\\n')
    })
})
