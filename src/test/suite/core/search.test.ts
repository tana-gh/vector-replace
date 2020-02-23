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
    assert.equal(matches[i][0]   , match)
    assert.equal(matches[i].index, index)
    assert.equal(matches[i].input, input)
}

suite('search', () => {
    test('normal search with empty searchStrings', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = <string[]>[]
        
        const params = types.createParams()

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 0)
    })

    test('normal search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'ijk' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('normal search with unmatching string', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'iii' ]

        const params = types.createParams()

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('normal search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })

    test('normal search ignore empty', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', '', 'defgh', 'ijk' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('normal search not ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 1)
        assertMatches(matches, 0, 'Abc', 5, input)
    })

    test('normal search ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const inputLower    = input.toLowerCase()
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]

        const params            = types.createParams()
        params.ignoreCaseSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, inputLower, searchFuncs, params)

        assert.equal(matches.length, 3)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, '!defgh',  6, input)
        assertMatches(matches, 1, '!!lmn' , 18, input)
    })

    test('normal search not ignore bang', () => {
        const input         = '-abc!-defgh!!-ijk!!!-'
        const searchStrings = [ 'abc!', 'defgh!!', 'ijk!!!' ]

        const params            = types.createParams()
        params.ignoreBangSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc!'   ,  1, input)
        assertMatches(matches, 1, 'defgh!!',  6, input)
        assertMatches(matches, 2, 'ijk!!!' , 14, input)
    })

    test('normal search not loop', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params = types.createParams()
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('normal search loop', () => {
        const input         = '-abc-defgh-abc-'
        const searchStrings = [ 'abc', 'defgh' ]

        const params      = types.createParams()
        params.loopSearch = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  , 1, input)
        assertMatches(matches, 1, 'defgh', 5, input)
    })

    test('regexp creating error', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\', '\\w{5}' ]
        
        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 1)
        assertMatches(matches, 0, 'abc', 1, input)
    })

    test('regexp search with empty searchStrings', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = <string[]>[]

        const params     = types.createParams()
        params.useRegExp = true
        
        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 0)
    })

    test('regexp search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\w{5}', '\\w{3}' ]
        
        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('regexp search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ '\\w{3}', '\\w{5}' ]

        const params     = types.createParams()
        params.useRegExp = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })

    test('regexp search not ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]
        
        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreCaseSearch = false

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 1)
        assertMatches(matches, 0, 'Abc', 5, input)
    })

    test('regexp search ignore case', () => {
        const input         = '-abc-Abc-ABC-'
        const searchStrings = [ 'Abc', 'Abc', 'Abc' ]
        
        const params            = types.createParams()
        params.useRegExp        = true
        params.ignoreCaseSearch = true

        const searchFuncs = search.createSearchFuncs(searchStrings, params)
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 2)
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
        const matches     = search.search(input, input, searchFuncs, params)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc!'   ,  1, input)
        assertMatches(matches, 1, 'defgh!!',  6, input)
        assertMatches(matches, 2, 'ijk!!!' , 14, input)
    })
})
