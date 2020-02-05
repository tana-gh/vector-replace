import * as assert from 'assert'
import * as types  from '../../core/types'
import * as search from '../../core/search'

const assertMatches = (
    matches: types.MatchResult[],
    i      : number,
    match  : string,
    index  : number,
    input  : string
) => {
    assert.equal(matches[i][0]   , match)
    assert.equal(matches[i].index, index)
    assert.equal(matches[i].input, input)
}

suite('search', () => {
    const input         = '-abc-defgh-ijk-'
    const searchStrings = [ 'abc', 'defgh', 'ijk' ]
    
    const searchFuncs = search.createSearchFuncs(searchStrings)
    const matches     = search.search(input, searchFuncs)

    assert.equal (matches.length, 3)
    assertMatches(matches, 0, 'abc'  ,  1, input)
    assertMatches(matches, 1, 'defgh',  5, input)
    assertMatches(matches, 2, 'ijk'  , 11, input)
})

suite('search 2', () => {
    const input         = '-abc-defgh-ijk-'
    const searchStrings = [ 'abc', 'defgh', 'iii' ]
    
    const searchFuncs = search.createSearchFuncs(searchStrings)
    const matches     = search.search(input, searchFuncs)

    assert.equal (matches.length, 2)
    assertMatches(matches, 0, 'abc'  ,  1, input)
    assertMatches(matches, 1, 'defgh',  5, input)
})
