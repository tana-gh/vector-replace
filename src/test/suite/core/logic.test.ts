import * as assert    from 'assert'
import * as coreTypes from '../../../core/types'
import * as logic     from '../../../core/logic'

const runGenerator = (gen: Generator<number, void>) => {
    while (true) {
        const next = gen.next()
        if (next.done) return
    }
}

suite('logic', () => {
    test('setInput', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setInput(vr, 'abc')
        assert.strictEqual(vr.text, 'abc')
    })

    test('setSearchStrings LF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setSearchStrings(vr, 'abc\ndef\nghi')

        assert.strictEqual(vr.searchStrings.length, 3)
        assert.strictEqual(vr.searchStrings[0], 'abc')
        assert.strictEqual(vr.searchStrings[1], 'def')
        assert.strictEqual(vr.searchStrings[2], 'ghi')
        assert.strictEqual(vr.searchFuncs.length, 3)
    })

    test('setSearchStrings CRLF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setSearchStrings(vr, 'abc\r\ndef\r\nghi')

        assert.strictEqual(vr.searchStrings.length, 3)
        assert.strictEqual(vr.searchStrings[0], 'abc')
        assert.strictEqual(vr.searchStrings[1], 'def')
        assert.strictEqual(vr.searchStrings[2], 'ghi')
        assert.strictEqual(vr.searchFuncs.length, 3)
    })

    test('setReplaceStrings LF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setReplaceStrings(vr, 'abc\ndef\nghi')
        
        assert.strictEqual(vr.replaceStrings.length, 3)
        assert.strictEqual(vr.replaceStrings[0], 'abc')
        assert.strictEqual(vr.replaceStrings[1], 'def')
        assert.strictEqual(vr.replaceStrings[2], 'ghi')
    })

    test('setReplaceStrings CRLF', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setReplaceStrings(vr, 'abc\r\ndef\r\nghi')
        
        assert.strictEqual(vr.replaceStrings.length, 3)
        assert.strictEqual(vr.replaceStrings[0], 'abc')
        assert.strictEqual(vr.replaceStrings[1], 'def')
        assert.strictEqual(vr.replaceStrings[2], 'ghi')
    })

    test('runSearch normal', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings(vr, 'abc\ndef\nghi')
        runGenerator(logic.runSearch(vr, { isCancelled: false }))
        
        assert.strictEqual(vr.matches.length, 3)
        assert.strictEqual(vr.matches[0][0], 'abc')
        assert.strictEqual(vr.matches[1][0], 'def')
        assert.strictEqual(vr.matches[2][0], 'ghi')
    })

    test('runSearch regexp', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, true)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings(vr, '\\w{3}\n\\w{3}\n\\w{3}')
        runGenerator(logic.runSearch(vr, { isCancelled: false }))
        
        assert.strictEqual(vr.matches.length, 3)
        assert.strictEqual(vr.matches[0][0], 'abc')
        assert.strictEqual(vr.matches[1][0], 'def')
        assert.strictEqual(vr.matches[2][0], 'ghi')
    })

    test('runSearch cancel', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings(vr, 'abc\ndef\nghi')
        runGenerator(logic.runSearch(vr, { isCancelled: true }))
        
        assert.strictEqual(vr.matches.length, 0)
    })

    test('runReplace normal', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings (vr, 'abc\ndef\nghi')
        logic.setReplaceStrings(vr, '123\n456\n789')
        runGenerator(logic.runSearch (vr, { isCancelled: false }))
        runGenerator(logic.runReplace(vr, { isCancelled: false }))

        assert.strictEqual(vr.text, '-123-456-789-')
    })

    test('runReplace regexp', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, true)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings (vr, '\\w{3}\n\\w{3}\n\\w{3}')
        logic.setReplaceStrings(vr, '123\n456\n789')
        runGenerator(logic.runSearch (vr, { isCancelled: false }))
        runGenerator(logic.runReplace(vr, { isCancelled: false }))

        assert.strictEqual(vr.text, '-123-456-789-')
    })

    test('runReplace cancel', () => {
        const vr = coreTypes.createVectorReplace()
        logic.setUseRegExp(vr, false)
        logic.setInput(vr, '-abc-def-ghi-')
        logic.setSearchStrings (vr, 'abc\ndef\nghi')
        logic.setReplaceStrings(vr, '123\n456\n789')
        runGenerator(logic.runSearch (vr, { isCancelled: false }))
        runGenerator(logic.runReplace(vr, { isCancelled: true }))

        assert.strictEqual(vr.text, '-abc-def-ghi-')
    })
})
