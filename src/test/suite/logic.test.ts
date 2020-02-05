import * as assert   from 'assert'
import * as dataUtil from '../util/dataUtil'
import * as logic    from '../../core/logic'

suite('setInput', () => {
    const vr = dataUtil.createVectorReplace()
    logic.setInput(vr, 'abc')
    assert.equal(vr.text, 'abc')
})

suite('setSearchStrings', () => {
    const vr = dataUtil.createVectorReplace()
    logic.setSearchStrings(vr, 'abc\ndef\nghi')

    assert.equal(vr.searchStrings.length, 3)
    assert.equal(vr.searchStrings[0], 'abc')
    assert.equal(vr.searchStrings[1], 'def')
    assert.equal(vr.searchStrings[2], 'ghi')
    assert.equal(vr.searchFuncs.length, 3)
})

suite('setReplaceStrings', () => {
    const vr = dataUtil.createVectorReplace()
    logic.setReplaceStrings(vr, 'abc\ndef\nghi')
    
    assert.equal(vr.replaceStrings.length, 3)
    assert.equal(vr.replaceStrings[0], 'abc')
    assert.equal(vr.replaceStrings[1], 'def')
    assert.equal(vr.replaceStrings[2], 'ghi')
})

suite('runSearch', () => {
    const vr = dataUtil.createVectorReplace()
    logic.setInput(vr, '-abc-def-ghi-')
    logic.setSearchStrings(vr, 'abc\ndef\nghi')
    logic.runSearch(vr)
    
    assert.equal(vr.matches.length, 3)
    assert.equal(vr.matches[0][0], 'abc')
    assert.equal(vr.matches[1][0], 'def')
    assert.equal(vr.matches[2][0], 'ghi')
})

suite('runReplace', () => {
    const vr = dataUtil.createVectorReplace()
    logic.setInput(vr, '-abc-def-ghi-')
    logic.setSearchStrings (vr, 'abc\ndef\nghi')
    logic.setReplaceStrings(vr, '123\n456\n789')
    logic.runSearch (vr)
    logic.runReplace(vr)

    assert.equal(vr.text, '-123-456-789-')
})
