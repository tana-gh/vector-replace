import * as assert from 'assert'
import * as types  from '../../../core/types'
import * as search from '../../../core/search'

const assertMatches = (
    matches : types.MatchResult[],
    i       : number,
    match   : string,
    index   : number,
    input   : string
) => {
    assert.strictEqual(matches[i][0]   , match)
    assert.strictEqual(matches[i].index, index)
    assert.strictEqual(matches[i].input, input)
}

suite('search', () => {
    test('normal search with empty searchStrings', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = <string[]>[]
        
        const params = types.createParams()

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 0)
    })

    test('normal search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'ijk' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('normal search with unmatching string', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'iii' ]

        const params = types.createParams()

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('normal search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })

    test('normal search ignore empty', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', '', 'defgh', 'ijk' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('normal search not ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, 'Abc', 5, input)
    })

    test('normal search ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const inputLower    = input.toLowerCase()
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]

        const params            = types.createParams()
        params.ignoreCaseSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, inputLower, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc', 1, input)
        assertMatches(matches, 1, 'Abc', 5, input)
        assertMatches(matches, 2, 'ABC', 9, input)
    })

    test('normal search ignore bang', () => {
        const input         = '-!abc-!defgh-!ijk-!!lmn-'
        const searchStrings = [ '!abc', '!!defgh', '!!!ijk', '!!!!lmn' ]

        const params            = types.createParams()
        params.ignoreBangSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, '!defgh',  6, input)
        assertMatches(matches, 1, '!!lmn' , 18, input)
    })

    test('normal search not ignore bang', () => {
        const input         = '-abc!-defgh!!-ijk!!!-'
        const searchStrings = [ 'abc!', 'defgh!!', 'ijk!!!' ]

        const params            = types.createParams()
        params.ignoreBangSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc!'   ,  1, input)
        assertMatches(matches, 1, 'defgh!!',  6, input)
        assertMatches(matches, 2, 'ijk!!!' , 14, input)
    })

    test('normal search not loop', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal search loop', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params      = types.createParams()
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'abc'  , 11, input)
    })

    test('normal search not just', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'abc'  , 11, input)
    })

    test('normal search just', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        params.loopSearch = true
        params.justSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal selection search 1', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 0, 0 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal selection search 2', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 15, 15 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal selection search 3', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 5, 10 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, 'defgh', 5, input)
    })

    test('normal selection search 4', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 4, 11 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, 'defgh', 5, input)
    })

    test('normal selection search 5', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 6, 11 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 0)
    })

    test('normal selection search 6', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 4, 9 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 0)
    })

    test('normal selection search 7', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh' ]
        const selections    = [ 1, 4, 5, 10 ]

        const params = types.createParams()
        params.selectionSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, selections, searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal matrix search', () => {
        const input         = '-abc-defgh-ijk-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'a', 'c', '-abc', 'abc-', '-' ]

        const params = types.createParams()
        params.matrixSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 9)
        assertMatches(matches, 0, '-'    ,  0, input)
        assertMatches(matches, 1, 'abc'  ,  1, input)
        assertMatches(matches, 2, '-'    ,  4, input)
        assertMatches(matches, 3, 'defgh',  5, input)
        assertMatches(matches, 4, '-'    , 10, input)
        assertMatches(matches, 5, 'abc'  , 11, input)
        assertMatches(matches, 6, '-'    , 14, input)
        assertMatches(matches, 7, 'defgh', 15, input)
        assertMatches(matches, 8, '-'    , 20, input)
    })

    test('regexp creating error', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\', '\\w{5}' ]
        
        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, 'abc', 1, input)
    })

    test('regexp search with empty searchStrings', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = <string[]>[]

        const params     = types.createParams()
        params.useRegExp = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 0)
    })

    test('regexp search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\w{5}', '\\w{3}' ]
        
        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('regexp search with unmatching string', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\w{5}', '\\w{4}' ]

        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('regexp search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ '\\w{3}', '\\w{5}' ]

        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })

    test('regexp search capture whole', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'ijk' ]

        const params     = types.createParams()
        params.useRegExp    = true
        params.captureWhole = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)

        assert.notStrictEqual(matches[0].pattern, /(abc)/  )
        assert.notStrictEqual(matches[1].pattern, /(defgh)/)
        assert.notStrictEqual(matches[2].pattern, /(ijk)/  )
    })

    test('regexp search not ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]
        
        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreCaseSearch = false

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, 'Abc', 5, input)
    })

    test('regexp search ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]
        
        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreCaseSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc', 1, input)
        assertMatches(matches, 1, 'Abc', 5, input)
        assertMatches(matches, 2, 'ABC', 9, input)
    })

    test('regexp search ignore bang', () => {
        const input         = '-!abc-!defgh-!ijk-!!lmn-'
        const searchStrings = [ '!\\w{3}', '!!\\w{5}', '!!!\\w{3}', '!!!!\\w{3}' ]

        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreBangSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, '!defgh',  6, input)
        assertMatches(matches, 1, '!!lmn' , 18, input)
    })

    test('regexp search not ignore bang', () => {
        const input         = '-abc!-defgh!!-ijk!!!-'
        const searchStrings = [ '\\w{3}!', '\\w{5}!!', '\\w{3}!!!' ]

        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreBangSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, 'abc!'   ,  1, input)
        assertMatches(matches, 1, 'defgh!!',  6, input)
        assertMatches(matches, 2, 'ijk!!!' , 14, input)
    })

    test('regexp search not loop with empty result', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '.*', '.*' ]
        
        const params     = types.createParams()
        params.useRegExp = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 2)
        assertMatches(matches, 0, '-abc-defgh-ijk-',  0, input)
        assertMatches(matches, 1, ''               , 15, input)
    })

    test('regexp search loop with empty result', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '.*' ]
        
        const params      = types.createParams()
        params.useRegExp  = true
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 1)
        assertMatches(matches, 0, '-abc-defgh-ijk-', 0, input)
    })

    test('regexp search not loop multiple lines LF', () => {
        const input         = '-abc-\n-defgh-\n-ijk-'
        const searchStrings = [ '.*', '.*', '.*' ]
        
        const params      = types.createParams()
        params.useRegExp  = true
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, '-abc-'  ,  0, input)
        assertMatches(matches, 1, '-defgh-',  6, input)
        assertMatches(matches, 2, '-ijk-'  , 14, input)
    })

    test('regexp search not loop multiple lines CRLF', () => {
        const input         = '-abc-\r\n-defgh-\r\n-ijk-'
        const searchStrings = [ '.*', '.*', '.*' ]
        
        const params      = types.createParams()
        params.useRegExp  = true
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, '-abc-'  ,  0, input)
        assertMatches(matches, 1, '-defgh-',  7, input)
        assertMatches(matches, 2, '-ijk-'  , 16, input)
    })

    test('regexp search loop multiple lines LF', () => {
        const input         = '-abc-\n-defgh-\n-ijk-'
        const searchStrings = [ '.*' ]
        
        const params      = types.createParams()
        params.useRegExp  = true
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, '-abc-'  ,  0, input)
        assertMatches(matches, 1, '-defgh-',  6, input)
        assertMatches(matches, 2, '-ijk-'  , 14, input)
    })

    test('regexp search loop multiple lines CRLF', () => {
        const input         = '-abc-\r\n-defgh-\r\n-ijk-'
        const searchStrings = [ '.*' ]
        
        const params      = types.createParams()
        params.useRegExp  = true
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, [], searchFuncs, params)

        assert.strictEqual(matches.length, 3)
        assertMatches(matches, 0, '-abc-'  ,  0, input)
        assertMatches(matches, 1, '-defgh-',  7, input)
        assertMatches(matches, 2, '-ijk-'  , 16, input)
    })
})
