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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
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
            types.createMatchResult([ 'abc'   ],  1, input, 'abc'  ),
            types.createMatchResult([ 'defgh' ],  5, input, 'defgh'),
            types.createMatchResult([ 'ijk'   ], 11, input, 'ijk'  ),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '-12-3-12-')
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
            '\\\\\\n',
        ]

        const params = types.createParams()

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'b' ],  0, input, 'b' ),
            types.createMatchResult([ 'b' ],  1, input, 'b' ),
            types.createMatchResult([ 'b' ],  2, input, 'b' ),
            types.createMatchResult([ 't' ],  3, input, 't' ),
            types.createMatchResult([ 't' ],  4, input, 't' ),
            types.createMatchResult([ 't' ],  5, input, 't' ),
            types.createMatchResult([ 'r' ],  6, input, 'r' ),
            types.createMatchResult([ 'r' ],  7, input, 'r' ),
            types.createMatchResult([ 'r' ],  8, input, 'r' ),
            types.createMatchResult([ 'n' ],  9, input, 'n' ),
            types.createMatchResult([ 'n' ], 10, input, 'n' ),
            types.createMatchResult([ 'n' ], 11, input, 'n' ),
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
            types.createMatchResult([ 'abc'   ],  1, input, /\w{3}/g),
            types.createMatchResult([ 'defgh' ],  5, input, /\w{5}/g),
            types.createMatchResult([ 'ijk'   ], 11, input, /\w{3}/g),
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
            types.createMatchResult([ 'abc'   ],  1, input, /a(b)c/g  ),
            types.createMatchResult([ 'defgh' ],  5, input, /(\w{5})/g),
            types.createMatchResult([ 'ijk'   ], 11, input, /(i)j(k)/g),
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
            '\\\\\\n',
        ]

        const params = types.createParams()
        params.useRegExp = true

        const replaceFuncs = replace.createReplaceFuncs(replaceStrings, params)
        const matches      = [
            types.createMatchResult([ 'b' ],  0, input, /b/g ),
            types.createMatchResult([ 'b' ],  1, input, /b/g ),
            types.createMatchResult([ 'b' ],  2, input, /b/g ),
            types.createMatchResult([ 't' ],  3, input, /t/g ),
            types.createMatchResult([ 't' ],  4, input, /t/g ),
            types.createMatchResult([ 't' ],  5, input, /t/g ),
            types.createMatchResult([ 'r' ],  6, input, /r/g ),
            types.createMatchResult([ 'r' ],  7, input, /r/g ),
            types.createMatchResult([ 'r' ],  8, input, /r/g ),
            types.createMatchResult([ 'n' ],  9, input, /n/g ),
            types.createMatchResult([ 'n' ], 10, input, /n/g ),
            types.createMatchResult([ 'n' ], 11, input, /n/g ),
        ]

        const output = replace.replace(input, replaceFuncs, matches, params)

        assert.strictEqual(output, '\\b\\b\\\\b\t\\t\\\t\r\\r\\\r\n\\n\\\n')
    })
})
