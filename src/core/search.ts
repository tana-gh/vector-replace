import * as types from './types'

export const search = (vr: types.VectorReplace) => {
    const gen = generateSearchFunc(vr)
    let prev = types.createMatchResult([], 0, '')

    while (true) {
        const func = gen.next().value
        const match = func(vr.input, prev)
        
        if (match === null) return

        vr.matches.push(match)
        prev = match
    }
}

const generateSearchFunc = function* (vr: types.VectorReplace) {
    while (true) {
        for (let funcs of vr.searchFuncs) {
            yield funcs
        }
    }
}

export const initSearchFuncs = (vr: types.VectorReplace) => {
    vr.searchFuncs = vr.searchStrings.map(s => (input: string, prev: types.MatchResult) => {
        const index = input.indexOf(s, prev.index)
        return index === -1 ? null : types.createMatchResult([ s ], index, input)
    })
}
