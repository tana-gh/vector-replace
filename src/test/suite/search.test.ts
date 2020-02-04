import * as assert   from 'assert'
import * as dataUtil from '../util/dataUtil'
import * as search   from '../../core/search'

suite('search', () => {
    const vr = dataUtil.createVectorReplace()
    vr.input = 'abc-defgh-ijk'
    vr.searchStrings = [ 'abc', 'defgh', 'ijk' ]
    search.initSearchFuncs(vr)
    search.search(vr)

    assert.equal(vr.matches[0][0], 'abc')
    assert.equal(vr.matches[0].index, 0)
    assert.equal(vr.matches[0].input, vr.input)
    assert.equal(vr.matches[1][0], 'defgh')
    assert.equal(vr.matches[1].index, 4)
    assert.equal(vr.matches[1].input, vr.input)
    assert.equal(vr.matches[2][0], 'ijk')
    assert.equal(vr.matches[2].index, 10)
    assert.equal(vr.matches[2].input, vr.input)
})
