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
        
        const searchFuncs = search.createSearchFuncs(searchStrings, false)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 0)
    })

    test('normal search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'ijk' ]
        
        const searchFuncs = search.createSearchFuncs(searchStrings, false)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('normal search with unmatching string', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ 'abc', 'defgh', 'iii' ]

        const searchFuncs = search.createSearchFuncs(searchStrings, false)
        const matches     = search.search(input, searchFuncs)

        assert.equal (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('normal search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ 'abc', 'defgh' ]
        
        const searchFuncs = search.createSearchFuncs(searchStrings, false)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })

    test('regexp search with empty searchStrings', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = <string[]>[]
        
        const searchFuncs = search.createSearchFuncs(searchStrings, true)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 0)
    })

    test('regexp search', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\w{5}', '\\w{3}' ]
        
        const searchFuncs = search.createSearchFuncs(searchStrings, true)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 3)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
        assertMatches(matches, 2, 'ijk'  , 11, input)
    })

    test('regexp search with unmatching string', () => {
        const input         = '-abc-defgh-ijk-'
        const searchStrings = [ '\\w{3}', '\\w{5}', '\\w{4}' ]

        const searchFuncs = search.createSearchFuncs(searchStrings, true)
        const matches     = search.search(input, searchFuncs)

        assert.equal (matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  5, input)
    })

    test('regexp search sequentialy', () => {
        const input         = '-abc-abc-defgh-'
        const searchStrings = [ '\\w{3}', '\\w{5}' ]

        const searchFuncs = search.createSearchFuncs(searchStrings, true)
        const matches     = search.search(input, searchFuncs)

        assert.equal(matches.length, 2)
        assertMatches(matches, 0, 'abc'  ,  1, input)
        assertMatches(matches, 1, 'defgh',  9, input)
    })
})
