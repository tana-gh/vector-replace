import * as assert    from 'assert'
import * as coreTypes from '../../../core/types'
import * as logic     from '../../../core/logic'

suite('logic', () => {
    test('setInput', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setInput(vr, 'abc')
        assert.equal(vr.text, 'abc')
    })

    test('setSearchStrings LF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setSearchStrings(vr, 'abc\ndef\nghi')

        assert.equal(vr.searchStrings.length, 3)
        assert.equal(vr.searchStrings[0], 'abc')
        assert.equal(vr.searchStrings[1], 'def')
        assert.equal(vr.searchStrings[2], 'ghi')
        assert.equal(vr.searchFuncs.length, 3)
    })

    test('setSearchStrings CRLF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setSearchStrings(vr, 'abc\r\ndef\r\nghi')

        assert.equal(vr.searchStrings.length, 3)
        assert.equal(vr.searchStrings[0], 'abc')
        assert.equal(vr.searchStrings[1], 'def')
        assert.equal(vr.searchStrings[2], 'ghi')
        assert.equal(vr.searchFuncs.length, 3)
    })

    test('setReplaceStrings LF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setReplaceStrings(vr, 'abc\ndef\nghi')
        
        assert.equal(vr.replaceStrings.length, 3)
        assert.equal(vr.replaceStrings[0], 'abc')
        assert.equal(vr.replaceStrings[1], 'def')
        assert.equal(vr.replaceStrings[2], 'ghi')
    })

    test('setReplaceStrings CRLF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setReplaceStrings(vr, 'abc\r\ndef\r\nghi')
        
        assert.equal(vr.replaceStrings.length, 3)
        assert.equal(vr.replaceStrings[0], 'abc')
        assert.equal(vr.replaceStrings[1], 'def')
        assert.equal(vr.replaceStrings[2], 'ghi')
    })

    test('runSearch normal', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings(vr, 'abc\ndef\nghi')
        logic.runSearch(vr)
        
        assert.equal(vr.matches.length, 3)
        assert.equal(vr.matches[0][0], 'abc')
        assert.equal(vr.matches[1][0], 'def')
        assert.equal(vr.matches[2][0], 'ghi')
    })

    test('runSearch regexp', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, true)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings(vr, '\\w{3}\n\\w{3}\n\\w{3}')
        logic.runSearch(vr)
        
        assert.equal(vr.matches.length, 3)
        assert.equal(vr.matches[0][0], 'abc')
        assert.equal(vr.matches[1][0], 'def')
        assert.equal(vr.matches[2][0], 'ghi')
    })

    test('runReplace normal', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings (vr, 'abc\ndef\nghi')
        logic.setReplaceStrings(vr, '123\n456\n789')
        logic.runSearch (vr)
        logic.runReplace(vr)

        assert.equal(vr.text, '-123-456-789-')
    })

    test('runReplace regexp', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, true)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings (vr, '\\w{3}\n\\w{3}\n\\w{3}')
        logic.setReplaceStrings(vr, '123\n456\n789')
        logic.runSearch (vr)
        logic.runReplace(vr)

        assert.equal(vr.text, '-123-456-789-')
    })
})
